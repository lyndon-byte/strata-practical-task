import express from 'express';
import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';
import { z } from 'zod';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';

const app = express();
const port = 3000;

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const c = {
  brand:   (t) => chalk.hex('#7C3AED')(t),       // violet
  dim:     (t) => chalk.hex('#6B7280')(t),        // muted gray
  label:   (t) => chalk.hex('#9CA3AF').bold(t),   // soft label
  value:   (t) => chalk.hex('#F9FAFB')(t),        // near-white value
  hi:      (t) => chalk.hex('#A78BFA').bold(t),   // accent highlight
  ok:      (t) => chalk.hex('#34D399')(t),        // green success
  warn:    (t) => chalk.hex('#FBBF24')(t),        // amber
  err:     (t) => chalk.hex('#F87171')(t),        // red
  faint:   (t) => chalk.hex('#374151')(t),        // barely-there border
};

// ── Urgency badge ────────────────────────────────────────────────
function urgencyBadge(urgency) {
  const u = urgency.toLowerCase();
  if (u.includes('high') || u.includes('critical')) return c.err(`▲ ${urgency.toUpperCase()}`);
  if (u.includes('medium') || u.includes('moderate')) return c.warn(`◆ ${urgency.toUpperCase()}`);
  return c.ok(`▼ ${urgency.toUpperCase()}`);
}

// ── Confidence bar ───────────────────────────────────────────────
function confidenceBar(pct) {
  const filled = Math.round(pct / 5);   // 20 blocks total
  const empty  = 20 - filled;
  const bar = c.hi('█'.repeat(filled)) + c.faint('░'.repeat(empty));
  const color = pct >= 80 ? c.ok : pct >= 50 ? c.warn : c.err;
  return `${bar}  ${color(pct + '%')}`;
}

// ── Banner ───────────────────────────────────────────────────────
function printBanner() {
  console.clear();
  const banner = [
    c.dim('  Client Enquiry Intelligence  '),
    c.dim(`  Port: ${port}  ·  GPT-4o  `),
  ].join('\n');

  console.log(
    boxen(banner, {
      padding:     { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: '#4C1D95',
    })
  );

  console.log(c.dim('\nType your enquiry and press Enter.  ') + c.dim('type exit to quit.\n'));
}

// ── Result card ──────────────────────────────────────────────────
function printResult(data) {
  const rows = [
    `${c.label('CLASSIFICATION')}   ${c.hi(data.classification.toUpperCase())}`,
    `${c.label('URGENCY      ')}   ${urgencyBadge(data.urgency)}`,
    `${c.label('CONFIDENCE   ')}   ${confidenceBar(data.confidence)}`,
    '',
    `${c.label('REASONING')}`,
    c.value(wrap(data.reasoning, 62)),
    '',
    `${c.label('RECOMMENDED ACTION')}`,
    c.ok('› ') + c.value(wrap(data.recommended_action, 60)),
    '',
    `${c.label('DRAFT RESPONSE')}`,
    c.dim('"') + c.value(wrap(data.draft_response, 62)) + c.dim('"'),
  ].join('\n');

  console.log(
    boxen(rows, {
      title:       c.brand(' Analysis '),
      titleAlignment: 'left',
      padding:     { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: '#4C1D95',
      margin:      { top: 1, bottom: 1 },
    })
  );
}

// ── Simple word-wrap ─────────────────────────────────────────────
function wrap(text, width) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + word).length > width) { lines.push(line.trimEnd()); line = ''; }
    line += word + ' ';
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines.join('\n  ');
}

// ── Main loop ────────────────────────────────────────────────────
async function startCliChat() {

  console.clear()

  printBanner();

  while (true) {
    const userInput = await terminal.question(
      c.brand(' ❯ ') + c.value('')
    );

    if (!userInput.trim()) continue;
    if (userInput.toLowerCase() === 'exit') {
      console.log('\n' + c.dim('  Bye.\n'));
      process.exit();
    }

    const spinner = ora({
      text:    c.dim('Analysing enquiry…'),
      spinner: 'dots',
      color:   'magenta',
      indent:  2,
    }).start();

    try {
      const { output } = await generateText({
        model: openai("gpt-4o"),
        output: Output.object({
          schema: z.object({
            clientEnquiry: z.object({
              classification:    z.string(),
              confidence:        z.int(),
              urgency:           z.string(),
              recommended_action: z.string(),
              draft_response:    z.string(),
              reasoning:         z.string(),
            }),
          }),
        }),
        prompt: userInput,
        system: `You are an AI assistant for Strata Management Consultants.

            Your role is to analyze incoming client enquiries and help staff process them efficiently.

            For every enquiry:
            1. Determine the enquiry classification.
            2. Estimate confidence level.
            3. Identify urgency level.
            4. Recommend the next internal action.
            5. Generate a professional draft response for staff to review.

            Allowed classifications:
            - New Client
            - Support Request
            - Complaint
            - General Question
            - Unknown

            Urgency levels:
            - Low
            - Medium
            - High
            - Critical

            Rules:
            - Be accurate, concise, and professional.
            - If the enquiry is vague, nonsensical, or lacks enough information, classify it as "Unknown".
            - Never hallucinate details not mentioned in the enquiry.
            - If confidence is low, explain why briefly.
            - Complaint-related enquiries should usually recommend escalation or human review.
            - Draft responses should sound professional, empathetic, and business-appropriate.
            - Recommended actions should be operational and practical.

        `
      });

      spinner.stop();
      printResult(output.clientEnquiry);

    } catch (err) {
      spinner.stop();
      console.log(
        boxen(c.err('Error: ') + c.value(err.message), {
          padding: 1,
          borderColor: 'red',
          borderStyle: 'round',
          margin: { top: 1, bottom: 1 },
        })
      );
    }
  }
}

app.listen(port, () => {
  startCliChat().catch(console.error);
});

## 📽️ Demo

| Overview | Setup Walkthrough |
|---|---|
| [![Loom Demo](https://img.shields.io/badge/▶%20Watch%20Demo-Loom-00897B?style=for-the-badge&logo=loom&logoColor=white)](https://www.loom.com/share/b01719fa435c449a90af76c8170b8ea8) | [![Loom Setup](https://img.shields.io/badge/▶%20Watch%20Setup-Loom-00897B?style=for-the-badge&logo=loom&logoColor=white)](https://www.loom.com/share/3598d64d11764382bda5ce087cb41ed9) |
| See the tool in action — live classification, urgency scoring, and draft responses | Step-by-step environment setup from clone to first run |

---

## ✨ What it does

type any client message into the terminal. The tool instantly returns:

- 🏷️ **Classification** — what type of enquiry it is
- ⚡ **Urgency** — High / Medium / Low with visual badge
- 📊 **Confidence** — percentage bar showing model certainty
- 🧠 **Reasoning** — why the AI classified it this way
- ✅ **Recommended Action** — what to do next
- ✍️ **Draft Response** — a ready-to-send reply

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- An [OpenAI API key](https://platform.openai.com/api-keys)
- Git

---

### 1 — Clone the repo

```bash
git clone https://github.com/lyndon-byte/strata-practical-task.git
cd strata-practical-task
```

---

### 2 — Configure environment

Find the `.env.example` file in the project root and rename it to `.env`:

```bash
# Mac / Linux
cp .env.example .env

# Windows CMD
copy .env.example .env
```

Then open `.env` and add your OpenAI key:

```env
OPENAI_API_KEY=sk-...your-key-here...
```
---

### 3 — Install dependencies

```bash
npm install
```

---

### 4 — Run

```bash
node .
```

The CLI will launch and you'll see the interactive prompt. Type any client message and press **Enter**.

Type `exit` to quit.

---

## 💻 Platform-specific steps

<details>
<summary><strong>🍎 macOS</strong></summary>

```bash
# 1. Clone
git clone https://github.com/lyndon-byte/strata-practical-task.git

# 2. Enter project folder
cd strata-practical-task

# 3. Copy and fill in .env
cp .env.example .env
open -e .env   # opens in TextEdit — paste your key, save

# 4. Install
npm install

# 5. Run
node .
```

</details>

<details>
<summary><strong>🪟 Windows (CMD)</strong></summary>

```cmd
:: 1. Clone
git clone https://github.com/lyndon-byte/strata-practical-task.git

:: 2. Enter project folder
cd strata-practical-task

:: 3. Copy .env
copy .env.example .env

:: 4. Open .env in Notepad and paste your API key
notepad .env

:: 5. Install
npm install

:: 6. Run
node .
```

> 💡 **Tip:** If the colored `❯` prompt or spinner doesn't render correctly, try running inside [Windows Terminal](https://aka.ms/terminal) instead of the legacy CMD.

</details>

---

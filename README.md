# ⚡ MindSpark AI - AI-Powered Study Assistant

> **Flam Frontend Internship Assignment Submission**  
> An interactive AI-powered Study Assistant built with **React**, **Express.js Proxy**, **Google Gemini LLM**, and **Tailwind CSS**. Converts free-form study notes or topic prompts into interactive, 3D flippable **Flashcards** and a **Multiple-Choice Quiz** with re-testing functionality for missed questions.

---

## 🌟 Key Features

1. **Free-Form Note & Topic Parser**: Input raw lecture notes, article summaries, or simple topic phrases with live word/character counts and sample test prompts.
2. **Interactive 3D Flashcard Deck**:
   - Flippable cards with smooth CSS 3D transforms.
   - Deck controls (Next, Previous, Flip, Shuffle).
   - Card index tracker & progress bar.
   - **Keyboard Navigation**: Arrow keys (`←` / `→`) to switch cards, `Space` or `Enter` to flip.
3. **Smart Multiple-Choice Quiz Engine**:
   - Interactive option selection with real-time tracking.
   - Detailed Score Summary & Percentage Gauge.
   - Answer key reveals with detailed concept explanations.
   - **🔥 Re-test Wrong Answers**: Dedicated button allowing users to re-take ONLY the questions answered incorrectly.
4. **Security & Proxy Architecture**: Express backend proxy guarantees the LLM API key (`GEMINI_API_KEY`) is **NEVER** exposed to client browser code.
5. **Defensive JSON Schema Validator (`validateResult.js`)**:
   - Strips markdown codeblock wrappers (` ```json ... ``` `).
   - Validates JSON structure, field types, array lengths, and bounds.
   - Gracefully handles missing fields, empty responses, or malformed outputs.
6. **Stale Request Race-Condition Guard**: Atomic counter using `useRef` and `AbortController` prevents slow or out-of-order API responses from overwriting newer user queries.
7. **Bulletproof Error & Loading States**: Animated skeletons and actionable "Try Again" error UI ensure zero crashes or blank screens.

---

## 🏗️ Project Architecture & Directory Structure

```text
flam/
├── server/
│   ├── index.js          # Express proxy forwarding prompts & holding GEMINI_API_KEY
│   └── .env.example      # Environment variables template
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx       # Free-form multi-line text input & sample pills
│   │   ├── FlashcardDeck.jsx     # 3D flippable card view + keyboard nav
│   │   ├── QuizView.jsx          # Interactive quiz, score summary & wrong answer re-testing
│   │   ├── ErrorState.jsx        # Diagnostic error UI with Retry handler
│   │   └── LoadingState.jsx      # Skeleton loader with dynamic status steps
│   ├── lib/
│   │   ├── api.js                # Frontend API client communicating strictly with proxy
│   │   ├── validateResult.js     # Strict defensive schema validator
│   │   └── validateResult.test.js# Automated unit tests for JSON parser
│   ├── App.jsx                   # State manager, race condition counter & tab layout
│   ├── index.css                 # Tailwind directives, 3D perspective & glassmorphism
│   └── main.jsx
├── README.md                     # Setup instructions & internship submission metadata
├── vite.config.js                # Vite configuration & dev proxy rules
└── package.json
```

---

## 🔐 Data Schema & LLM Prompting

The LLM is prompted with strict constraints to output raw JSON matching this schema:

```json
{
  "topic": "Photosynthesis & Cell Energy",
  "flashcards": [
    {
      "id": "card_1",
      "front": "What is chlorophyll?",
      "back": "Green pigment in chloroplasts that absorbs light energy."
    }
  ],
  "quiz": [
    {
      "id": "quiz_1",
      "question": "Where do light-dependent reactions occur?",
      "options": ["Thylakoid Membrane", "Stroma", "Nucleus", "Ribosome"],
      "correctIndex": 0,
      "explanation": "Light reactions occur in the thylakoid membrane of chloroplasts."
    }
  ]
}
```

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/flam-study-assistant.git
cd flam
npm install
```

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` folder:

```bash
# In server/.env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
> 💡 *Note: If `GEMINI_API_KEY` is not set, the proxy server operates in **Smart Fallback Mode**, generating realistic study datasets locally so you can test the application UI immediately without an API key.*

### 3. Run Development Server
Run both the frontend (Vite port 3000) and Express proxy (port 5000) concurrently:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### 4. Run Automated Unit Tests
To run tests for the defensive JSON validator:
```bash
npm test
```

---

## 🛡️ Race Condition & Stale Request Handling

When a user submits multiple requests in rapid succession:
1. `App.jsx` increments `requestIdRef.current` (atomic counter).
2. Any pending `fetch` request is aborted via `AbortController`.
3. When an API call resolves, the response request ID is compared against `requestIdRef.current`. If a newer request was made in the meantime, the stale response is silently dropped.

---

## 🤖 AI Tools Usage Disclosure

As required by the assignment guidelines:
- **AI Models Used**: Google Gemini 2.5 Flash / Claude 3.5 Sonnet for code scaffolding assistance and initial Tailwind styling ideas.
- **Human Guidance & Engineering**:
  - Authored the defensive schema validator logic (`validateResult.js`).
  - Implemented the 3D CSS card flip mechanism and keyboard navigation event listeners (`FlashcardDeck.jsx`).
  - Designed the stateful quiz re-test algorithm (`QuizView.jsx`).
  - Implemented the request ID counter guard (`App.jsx`).

---

## ⚠️ Known Limitations & Edge Cases

1. **Context Window Limits**: Extremely long inputs (over 20,000 characters) may exceed prompt limits. Input is recommended under 5,000 words.
2. **API Rate Limits**: Standard free-tier Gemini API keys have rate limits (15 requests/min). The backend proxy provides friendly HTTP 429 error messages when rate limited.
3. **Mobile Landscape Perspective**: 3D card flipping works best in portrait or standard desktop viewports; very small landscape screens auto-adjust font size.

---

## ⏱️ Time Spent Breakdown

| Phase / Task | Description | Hours |
| :--- | :--- | :---: |
| **1. Architecture & Setup** | Planning, Vite config, Express proxy setup, CORS & Env security | 1.0 hr |
| **2. Defensive Validator & API** | Writing `validateResult.js`, regex backtick strip, edge case testing | 1.5 hrs |
| **3. UI Components** | Building `PromptInput`, `FlashcardDeck` 3D animation, `QuizView` | 2.5 hrs |
| **4. Quiz Re-Test & Navigation** | Implementing wrong answer re-test engine & keyboard arrow shortcuts | 1.5 hrs |
| **5. Race Condition Guard & Polish**| `useRef` stale request protection, glassmorphic CSS theme & documentation | 1.5 hrs |
| **TOTAL** | | **8.0 hrs** |

---

## 📄 License
MIT License - Built for Flam Frontend Internship Evaluation.

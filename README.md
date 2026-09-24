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

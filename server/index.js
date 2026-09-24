import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.GEMINI_API_KEY
  });
});

/**
 * System Prompt instructing LLM to generate strict raw JSON schema
 */
const SYSTEM_PROMPT = `You are an expert AI study assistant. Your task is to analyze user study notes or a topic prompt and create high-yield study materials: interactive Flashcards and a Multiple-Choice Quiz.

STRICT MANDATORY RULES:
1. Output ONLY valid, raw JSON. Do NOT wrap in markdown \`\`\`json code blocks. Do NOT include introductory prose or conversational text.
2. Produce a single JSON object matching this exact shape:
{
  "topic": "Concise title summarizing the content",
  "flashcards": [
    {
      "id": "card_1",
      "front": "Clear question, concept, or term",
      "back": "Detailed, easy-to-understand explanation or answer"
    }
  ],
  "quiz": [
    {
      "id": "quiz_1",
      "question": "Clear multiple choice question testing key understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed explanation of why the correct option is right"
    }
  ]
}

3. Generate exactly 5-8 flashcards and 4-6 quiz questions.
4. "correctIndex" MUST be an integer between 0 and 3 corresponding to the correct option index in "options".
5. Every option in "options" must be unique, non-empty, and plausible.
6. Make "id" fields unique strings (e.g. card_1, card_2... quiz_1, quiz_2...).`;

/**
 * Helper to generate smart fallback data when GEMINI_API_KEY is missing
 */
function generateFallbackStudyData(promptText) {
  const cleanPrompt = promptText.trim();
  const topic = cleanPrompt.length < 30 ? cleanPrompt : cleanPrompt.split('\n')[0].slice(0, 40) + '...';

  return {
    topic: `Study Guide: ${topic}`,
    flashcards: [
      {
        id: "card_1",
        front: `What is the core focus of ${topic}?`,
        back: `The fundamental principles of ${topic} revolve around understanding key concepts, practical application, and analyzing underlying mechanisms.`
      },
      {
        id: "card_2",
        front: `Key Concept 1 in ${topic}`,
        back: `This concept emphasizes foundational mechanisms, system architecture, and operational workflows essential for mastery.`
      },
      {
        id: "card_3",
        front: `Common misconception about ${topic}`,
        back: `A frequent misunderstanding is oversimplifying the execution layer; in reality, state management and boundary condition handling are critical.`
      },
      {
        id: "card_4",
        front: `Real-world application of ${topic}`,
        back: `It is widely utilized in software design, problem-solving, and system optimization to achieve high reliability and performance.`
      },
      {
        id: "card_5",
        front: `Best practices when studying ${topic}`,
        back: `Focus on active recall, spaced repetition, dissecting edge cases, and testing understanding through quiz questions.`
      }
    ],
    quiz: [
      {
        id: "quiz_1",
        question: `Which statement best describes the primary goal of ${topic}?`,
        options: [
          `To establish structured principles and efficient problem solving`,
          `To bypass security and code quality checks`,
          `To replace all database models with flat text files`,
          `To eliminate the need for error logging and monitoring`
        ],
        correctIndex: 0,
        explanation: `Establishing structured principles and efficient problem solving is the core goal of ${topic}.`
      },
      {
        id: "quiz_2",
        question: `What is a critical consideration when implementing ${topic}?`,
        options: [
          `Ignoring edge cases and race conditions`,
          `Handling malformed inputs, timeouts, and state safety`,
          `Hardcoding production keys directly in public frontend repositories`,
          `Disabling CORS policies unconditionally`
        ],
        correctIndex: 1,
        explanation: `Robust applications must always handle malformed inputs, timeouts, and state safety gracefully.`
      },
      {
        id: "quiz_3",
        question: `Why is defensive input validation essential in ${topic}?`,
        options: [
          `It slows down server response times intentionally`,
          `It prevents malformed data shapes from breaking application UI`,
          `It disables browser cache automatically`,
          `It converts all numbers into strings`
        ],
        correctIndex: 1,
        explanation: `Defensive validation ensures that unpredictable or malformed data shapes never crash the UI.`
      },
      {
        id: "quiz_4",
        question: `How should stale asynchronous requests be managed in high-speed UIs?`,
        options: [
          `Allow older slow requests to overwrite newer user state`,
          `Ignore network latency entirely`,
          `Use request IDs or counters (useRef) to drop out-of-order responses`,
          `Reload the browser on every network request`
        ],
        correctIndex: 2,
        explanation: `Using request IDs or counters allows the application to detect and safely ignore stale, out-of-order responses.`
      }
    ]
  };
}

// POST /api/generate endpoint
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      error: 'Invalid Request',
      message: 'Prompt text is required and cannot be empty.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback mode if no API key is provided
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.log('[Proxy Server] GEMINI_API_KEY not configured. Returning fallback structured study guide.');
    // Add artificial small delay to mimic network latency
    await new Promise(r => setTimeout(r, 800));
    return res.json(generateFallbackStudyData(prompt));
  }

  try {
    console.log('[Proxy Server] Dispatching request to Gemini API...');
    
    // Call Gemini API REST endpoint using fetch
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\nUSER PROMPT / NOTES:\n${prompt}` }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Proxy Server] Gemini API HTTP Error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'LLM Service Error',
        message: `Gemini API returned status ${response.status}. Please check your API key or quota.`
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error('[Proxy Server] Empty text returned from Gemini API', data);
      return res.status(500).json({
        error: 'Empty LLM Response',
        message: 'The AI service returned an empty response. Please try rephrasing your prompt.'
      });
    }

    // Return the raw text string to frontend to let defensive validator handle parsing & verification
    res.json({ rawText });

  } catch (error) {
    console.error('[Proxy Server] Network or Execution Error:', error);
    res.status(500).json({
      error: 'Proxy Execution Error',
      message: error.message || 'An unexpected error occurred while communicating with the AI service.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 MindSpark Proxy Backend running on port ${PORT}`);
  console.log(`🔑 GEMINI_API_KEY Configured: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO (Fallback active)'}`);
  console.log(`=================================================`);
});

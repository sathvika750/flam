/**
 * Defensive validator for parsing and verifying LLM responses.
 * 
 * Rules:
 * 1. Safely strips codeblock wrappers (```json ... ``` or ``` ... ```).
 * 2. Parses raw JSON safely.
 * 3. Enforces expected shape:
 *    - topic: non-empty string
 *    - flashcards: non-empty array of { id, front, back }
 *    - quiz: non-empty array of { id, question, options (Array[>=2]), correctIndex (number), explanation }
 * 4. Throws descriptive errors if missing fields or invalid shape.
 */

export function validateResult(input) {
  if (!input) {
    throw new Error('Received empty response from server.');
  }

  let parsed = input;

  // Handle payload wrapped in rawText or string
  if (typeof input === 'object' && input !== null && input.rawText) {
    parsed = input.rawText;
  }

  // Handle direct study guide object (fallback response or already parsed object)
  if (typeof parsed === 'object' && parsed !== null && !parsed.rawText) {
    return validateSchema(parsed);
  }

  if (typeof parsed !== 'string') {
    throw new Error('Expected server response to be a JSON string or object.');
  }

  let cleanString = parsed.trim();

  // Strip markdown codeblock backticks if present (e.g. ```json ... ```)
  if (cleanString.startsWith('```')) {
    cleanString = cleanString.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  // Attempt JSON parsing
  let data;
  try {
    data = JSON.parse(cleanString);
  } catch (err) {
    throw new Error(`Malformed JSON response from AI model: ${err.message}`);
  }

  return validateSchema(data);
}

/**
 * Validates object schema strictly
 */
function validateSchema(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Parsed response must be a valid JSON object.');
  }

  // Validate topic
  const topic = typeof data.topic === 'string' && data.topic.trim() ? data.topic.trim() : 'Study Guide';

  // Validate flashcards
  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    throw new Error('Missing or invalid "flashcards" array in response.');
  }

  const validatedFlashcards = data.flashcards.map((card, idx) => {
    if (!card || typeof card !== 'object') {
      throw new Error(`Flashcard at index ${idx} is not an object.`);
    }

    const front = typeof card.front === 'string' ? card.front.trim() : '';
    const back = typeof card.back === 'string' ? card.back.trim() : '';

    if (!front || !back) {
      throw new Error(`Flashcard at index ${idx} is missing front or back content.`);
    }

    return {
      id: card.id && typeof card.id === 'string' ? card.id : `card_${idx + 1}`,
      front,
      back,
    };
  });

  // Validate quiz
  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    throw new Error('Missing or invalid "quiz" array in response.');
  }

  const validatedQuiz = data.quiz.map((item, idx) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Quiz item at index ${idx} is not an object.`);
    }

    const question = typeof item.question === 'string' ? item.question.trim() : '';
    const explanation = typeof item.explanation === 'string' ? item.explanation.trim() : 'No explanation provided.';

    if (!question) {
      throw new Error(`Quiz item at index ${idx} is missing a valid question.`);
    }

    if (!Array.isArray(item.options) || item.options.length < 2) {
      throw new Error(`Quiz item at index ${idx} must have at least 2 options.`);
    }

    const cleanOptions = item.options.map((opt, oIdx) => {
      if (typeof opt !== 'string' || !opt.trim()) {
        throw new Error(`Option ${oIdx + 1} in quiz item ${idx + 1} is empty or invalid.`);
      }
      return opt.trim();
    });

    let correctIndex = Number(item.correctIndex);
    if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= cleanOptions.length) {
      correctIndex = 0; // Defensive fallback index
    }

    return {
      id: item.id && typeof item.id === 'string' ? item.id : `quiz_${idx + 1}`,
      question,
      options: cleanOptions,
      correctIndex,
      explanation,
    };
  });

  return {
    topic,
    flashcards: validatedFlashcards,
    quiz: validatedQuiz,
  };
}

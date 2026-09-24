import { validateResult } from './validateResult.js';

const API_BASE = '/api';

/**
 * Sends a study generation request to the Express backend proxy.
 * 
 * @param {string} prompt - User notes or topic text.
 * @param {AbortSignal} [signal] - Optional signal for request cancellation/race condition handling.
 * @returns {Promise<{topic: string, flashcards: Array, quiz: Array}>}
 */
export async function generateStudyMaterial(prompt, signal) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Please enter notes or a topic before generating.');
  }

  // Setup abort controller for 30-second timeout if signal not provided
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), 30000);

  // Combine custom signal and timeout signal if applicable
  const effectiveSignal = signal || timeoutController.signal;

  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: effectiveSignal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP status ${response.status}` };
      }

      throw new Error(errorData.message || `Server error (${response.status})`);
    }

    const json = await response.json();

    // Use defensive validator to parse and guarantee shape
    return validateResult(json);
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error('Request timed out or was superseded by a newer search.');
    }

    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error('Unable to connect to proxy backend server. Ensure server is running on port 5000.');
    }

    throw err;
  }
}

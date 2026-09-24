import test from 'node:test';
import assert from 'node:assert/strict';
import { validateResult } from './validateResult.js';

test('validateResult parses valid JSON structure', () => {
  const input = JSON.stringify({
    topic: 'Photosynthesis',
    flashcards: [
      { id: 'c1', front: 'What is chlorophyll?', back: 'Green pigment in plants.' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What powers photosynthesis?',
        options: ['Sunlight', 'Wind', 'Gravity', 'Sound'],
        correctIndex: 0,
        explanation: 'Sunlight supplies energy.'
      }
    ]
  });

  const result = validateResult(input);
  assert.equal(result.topic, 'Photosynthesis');
  assert.equal(result.flashcards.length, 1);
  assert.equal(result.quiz.length, 1);
});

test('validateResult strips ```json markdown backticks', () => {
  const input = "```json\n{\n  \"topic\": \"Cellular Respiration\",\n  \"flashcards\": [{\"id\":\"1\",\"front\":\"ATP\",\"back\":\"Energy currency\"}],\n  \"quiz\": [{\"id\":\"q1\",\"question\":\"Where does it occur?\",\"options\":[\"Mitochondria\", \"Nucleus\"],\"correctIndex\":0,\"explanation\":\"Mitochondria produce ATP.\"}]\n}\n```";

  const result = validateResult(input);
  assert.equal(result.topic, 'Cellular Respiration');
  assert.equal(result.flashcards[0].front, 'ATP');
});

test('validateResult throws on invalid JSON or missing arrays', () => {
  assert.throws(() => validateResult('invalid json string'), /Malformed JSON response/);
  assert.throws(() => validateResult(JSON.stringify({ topic: 'Test' })), /Missing or invalid "flashcards" array/);
});

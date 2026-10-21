import type { WordEntry } from '@scribblio/shared';

const wordBank: WordEntry[] = [
  { word: 'cat', category: 'Animals', difficulty: 'easy', language: 'en' },
  { word: 'dog', category: 'Animals', difficulty: 'easy', language: 'en' },
  { word: 'tree', category: 'Nature', difficulty: 'easy', language: 'en' },
  { word: 'apple', category: 'Food', difficulty: 'easy', language: 'en' },
  { word: 'basketball', category: 'Sports', difficulty: 'medium', language: 'en' },
  { word: 'rocket', category: 'Transportation', difficulty: 'medium', language: 'en' },
  { word: 'pencil', category: 'School', difficulty: 'easy', language: 'en' },
  { word: 'doctor', category: 'Jobs', difficulty: 'easy', language: 'en' },
  { word: 'cup', category: 'Household', difficulty: 'easy', language: 'en' },
  { word: 'dragon', category: 'Fantasy', difficulty: 'hard', language: 'en' },
  { word: 'rainbow', category: 'Nature', difficulty: 'easy', language: 'en' },
  { word: 'guitar', category: 'Music', difficulty: 'medium', language: 'en' },
  { word: 'pizza', category: 'Food', difficulty: 'easy', language: 'en' },
  { word: 'mountain', category: 'Nature', difficulty: 'medium', language: 'en' },
  { word: 'robot', category: 'Fantasy', difficulty: 'medium', language: 'en' },
  { word: 'bicycle', category: 'Transportation', difficulty: 'medium', language: 'en' },
  { word: 'castle', category: 'Fantasy', difficulty: 'medium', language: 'en' },
  { word: 'flower', category: 'Nature', difficulty: 'easy', language: 'en' },
  { word: 'telescope', category: 'School', difficulty: 'hard', language: 'en' },
  { word: 'strawberry', category: 'Food', difficulty: 'medium', language: 'en' },
  { word: 'lighthouse', category: 'Nature', difficulty: 'hard', language: 'en' },
  { word: 'scooter', category: 'Transportation', difficulty: 'easy', language: 'en' },
  { word: 'campfire', category: 'Nature', difficulty: 'medium', language: 'en' },
  { word: 'teacher', category: 'School', difficulty: 'easy', language: 'en' },
  { word: 'sunflower', category: 'Nature', difficulty: 'easy', language: 'en' },
  { word: 'mermaid', category: 'Fantasy', difficulty: 'medium', language: 'en' },
  { word: 'microwave', category: 'Household', difficulty: 'medium', language: 'en' },
  { word: 'notebook', category: 'School', difficulty: 'easy', language: 'en' },
  { word: 'volcano', category: 'Nature', difficulty: 'hard', language: 'en' },
  { word: 'octopus', category: 'Animals', difficulty: 'medium', language: 'en' },
  { word: 'tractor', category: 'Transportation', difficulty: 'medium', language: 'en' },
];

export function getWordOptions(difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed', count = 3): WordEntry[] {
  const filtered = difficulty === 'mixed'
    ? wordBank
    : wordBank.filter((word) => word.difficulty === difficulty);

  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

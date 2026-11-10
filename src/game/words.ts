import type { Difficulty } from './types';

// 依長度分級，讓不同難度的單字與輸入挑戰清楚區隔。
const WORD_BANK: Record<Difficulty, string[]> = {
  easy: [
    'apple', 'beach', 'black', 'bread', 'brick', 'chair', 'chess', 'clean', 'cloud', 'dance',
    'dream', 'drink', 'earth', 'empty', 'faith', 'field', 'flame', 'focus', 'fruit', 'ghost',
    'grape', 'green', 'happy', 'heart', 'horse', 'house', 'human', 'light', 'magic', 'match',
    'melon', 'music', 'night', 'ocean', 'paper', 'peace', 'plant', 'queen', 'radio', 'river',
    'smile', 'sound', 'space', 'spoon', 'storm', 'table', 'tiger', 'train', 'water', 'white',
    'world', 'write', 'young', 'brave', 'candy', 'clock', 'dance', 'eager', 'fresh', 'giant',
  ],
  medium: [
    'airport', 'another', 'balance', 'blanket', 'breathe', 'captain', 'careful', 'central', 'channel', 'chicken',
    'citizen', 'company', 'curious', 'diamond', 'distant', 'evening', 'example', 'fantasy', 'feature', 'freedom',
    'gallery', 'general', 'glacier', 'horizon', 'imagine', 'journey', 'kitchen', 'library', 'machine', 'measure',
    'mystery', 'natural', 'orchard', 'perfect', 'picture', 'plastic', 'promise', 'quality', 'rainbow', 'routine',
    'science', 'silence', 'station', 'thought', 'traffic', 'uniform', 'village', 'weather', 'whisper', 'without',
    'workout', 'crystal', 'display', 'harvest', 'message', 'mixture', 'observe', 'pattern', 'support', 'trouble',
  ],
  hard: [
    'adventure', 'beautiful', 'butterfly', 'celebrate', 'challenge', 'character', 'community', 'dangerous', 'different', 'education',
    'excellent', 'expensive', 'fantastic', 'important', 'knowledge', 'landscape', 'marvelous', 'mountains', 'necessary', 'photograph',
    'pineapple', 'playground', 'remember', 'wonderful', 'attention', 'brilliant', 'chemistry', 'determine', 'equipment', 'excellent',
    'fortunate', 'government', 'happiness', 'invisible', 'lightning', 'magnitude', 'nutrition', 'operation', 'passenger', 'recycling',
    'sincerely', 'telephone', 'telescope', 'transform', 'universal', 'volunteer', 'yesterday', 'confidence', 'discovery', 'impossible',
    'literature', 'whenever', 'successful', 'technology', 'vocabulary', 'celebration', 'understand', 'friendship', 'curiosity', 'reflection',
  ],
};

export const DIFFICULTIES: { value: Difficulty; label: string; detail: string }[] = [
  { value: 'easy', label: '簡單', detail: '5 字母以下' },
  { value: 'medium', label: '中等', detail: '6–8 字母' },
  { value: 'hard', label: '困難', detail: '9 字母以上' },
];

export function getWordPool(difficulty: Difficulty): string[] {
  return WORD_BANK[difficulty];
}

export function getSpawnInterval(difficulty: Difficulty, elapsed: number): number {
  const base = { easy: 2600, medium: 2050, hard: 1550 }[difficulty];
  return Math.max(850, base - elapsed * 14);
}

export function getFallSpeed(difficulty: Difficulty, elapsed: number): number {
  const base = { easy: 7.5, medium: 10, hard: 12.5 }[difficulty];
  return base + elapsed * 0.12;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'ready' | 'playing' | 'paused' | 'over';

export interface FallingWord {
  id: number;
  text: string;
  x: number;
  y: number;
}

export interface ClearEffect {
  id: number;
  text: string;
  x: number;
  y: number;
  expiresAt: number;
}

export interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  score: number;
  lives: number;
  elapsed: number;
  words: FallingWord[];
  effects: ClearEffect[];
  input: string;
  feedback: { kind: 'error' | 'success'; text: string } | null;
}

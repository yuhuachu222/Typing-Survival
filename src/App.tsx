import { useEffect, useReducer, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Shield, Zap } from 'lucide-react';
import GameBoard from './components/GameBoard';
import StatsBar from './components/StatsBar';
import TypingInput from './components/TypingInput';
import { getFallSpeed, getSpawnInterval, getWordPool } from './game/words';
import type { Difficulty, FallingWord, GameState } from './game/types';

const INITIAL_STATE: GameState = {
  status: 'ready',
  difficulty: 'medium',
  score: 0,
  lives: 3,
  elapsed: 0,
  words: [],
  effects: [],
  input: '',
  feedback: null,
};

const FALL_LINE = 92;
const MAX_WORDS = 8;

type GameAction =
  | { type: 'START'; difficulty: Difficulty }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'TICK'; delta: number }
  | { type: 'SPAWN'; word: FallingWord }
  | { type: 'TYPE'; value: string }
  | { type: 'CLEAR_FEEDBACK' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return { ...INITIAL_STATE, status: 'playing', difficulty: action.difficulty };
    case 'PAUSE':
      return { ...state, status: 'paused', input: '' };
    case 'RESUME':
      return { ...state, status: 'playing' };
    case 'SET_DIFFICULTY':
      return state.status === 'playing' || state.status === 'paused'
        ? state
        : { ...state, difficulty: action.difficulty };
    case 'TICK': {
      if (state.status !== 'playing') return state;
      const elapsed = state.elapsed + action.delta;
      const speed = getFallSpeed(state.difficulty, state.elapsed);
      const movingWords = state.words.map((word) => ({ ...word, y: word.y + speed * action.delta }));
      const missedCount = movingWords.filter((word) => word.y >= FALL_LINE).length;
      const lives = Math.max(0, state.lives - missedCount);
      return {
        ...state,
        elapsed,
        lives,
        words: movingWords.filter((word) => word.y < FALL_LINE),
        effects: state.effects.filter((effect) => effect.expiresAt > elapsed),
        status: lives === 0 ? 'over' : state.status,
        input: lives === 0 ? '' : state.input,
      };
    }
    case 'SPAWN':
      if (state.status !== 'playing' || state.words.length >= MAX_WORDS) return state;
      return { ...state, words: [...state.words, action.word] };
    case 'TYPE': {
      if (state.status !== 'playing') return state;
      const value: string = action.value;
      if (!value) return { ...state, input: '', feedback: null };
      const matched = state.words.find((word) => word.text === value);
      if (matched) {
        return {
          ...state,
          input: '',
          score: state.score + 10,
          words: state.words.filter((word) => word.id !== matched.id),
          effects: [...state.effects, { ...matched, expiresAt: state.elapsed + 0.55 }],
          feedback: { kind: 'success', text: `漂亮！「${matched.text}」已消除 +10` },
        };
      }
      if (state.words.some((word) => word.text.startsWith(value))) {
        return { ...state, input: value, feedback: null };
      }
      return { ...state, input: '', feedback: { kind: 'error', text: '目前沒有符合的單字，再看清楚一點！' } };
    }
    case 'CLEAR_FEEDBACK':
      return { ...state, feedback: null };
    default:
      return state;
  }
}

function readBestScore(): number {
  try {
    return Number(window.localStorage.getItem('typing-survival-best') ?? 0) || 0;
  } catch {
    return 0;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [bestScore, setBestScore] = useState(readBestScore);
  const inputRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef(state);
  const nextWordId = useRef(0);
  stateRef.current = state;

  useEffect(() => {
    try {
      window.localStorage.setItem('typing-survival-best', String(bestScore));
    } catch {
      // 儲存空間不可用時仍可正常遊玩。
    }
  }, [bestScore]);

  useEffect(() => {
    if (state.score > bestScore) setBestScore(state.score);
  }, [bestScore, state.score]);

  useEffect(() => {
    if (!state.feedback) return;
    const timeout = window.setTimeout(() => dispatch({ type: 'CLEAR_FEEDBACK' }), 1800);
    return () => window.clearTimeout(timeout);
  }, [state.feedback]);

  // 只在遊戲進行中建立一條更新循環；暫停或結束時會立即清除。
  useEffect(() => {
    if (state.status !== 'playing') return;
    let previousTime = performance.now();
    let spawnElapsed = 0;
    const interval = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min((now - previousTime) / 1000, 0.12);
      previousTime = now;
      spawnElapsed += delta * 1000;
      dispatch({ type: 'TICK', delta });

      const current = stateRef.current;
      const spawnInterval = getSpawnInterval(current.difficulty, current.elapsed);
      if (spawnElapsed >= spawnInterval && current.words.length < MAX_WORDS) {
        spawnElapsed = 0;
        const activeWords = new Set(current.words.map((word) => word.text));
        const choices = getWordPool(current.difficulty).filter((word) => !activeWords.has(word));
        if (choices.length > 0) {
          const text = choices[Math.floor(Math.random() * choices.length)];
          dispatch({
            type: 'SPAWN',
            word: { id: nextWordId.current++, text, x: 8 + Math.random() * 84, y: 3 },
          });
        }
      }
    }, 40);
    return () => window.clearInterval(interval);
  }, [state.status, state.difficulty]);

  useEffect(() => {
    if (state.status === 'playing') inputRef.current?.focus();
  }, [state.status]);

  function startGame() {
    nextWordId.current = 0;
    dispatch({ type: 'START', difficulty: state.difficulty });
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleDifficultyChange(event: React.ChangeEvent<HTMLSelectElement>) {
    dispatch({ type: 'SET_DIFFICULTY', difficulty: event.target.value as Difficulty });
  }

  return (
    <main className="app-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="app-content">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Typing Survival 首頁">
            <span className="brand-mark"><Zap size={19} fill="currentColor" /></span>
            <span className="brand-name">TYPING<span> / </span>SURVIVAL</span>
          </a>
          <div className="topbar-right"><span className="connection-state"><span />系統連線正常</span><span className="version-tag">訓練模組 01</span></div>
        </header>

        <section className="hero-row" id="top">
          <div>
            <div className="eyebrow"><span /> 英文打字生存戰</div>
            <h1>Typing <span>Survival</span></h1>
            <p className="hero-copy">你的反應，就是最後一道防線。</p>
          </div>
          <div className="hero-emblem" aria-hidden="true"><Shield size={29} strokeWidth={1.5} /><span>TS</span></div>
        </section>

        <StatsBar score={state.score} lives={state.lives} elapsed={state.elapsed} bestScore={bestScore} />

        <section className="game-section" aria-label="遊戲控制與戰場">
          <div className="game-toolbar">
            <div className="difficulty-control">
              <label htmlFor="difficulty">難度</label>
              <select id="difficulty" value={state.difficulty} onChange={handleDifficultyChange} disabled={state.status === 'playing' || state.status === 'paused'}>
                <option value="easy">簡單</option>
                <option value="medium">中等</option>
                <option value="hard">困難</option>
              </select>
            </div>
            <div className="toolbar-actions">
              {state.status === 'playing' ? (
                <button className="secondary-button" onClick={() => dispatch({ type: 'PAUSE' })}><Pause size={15} />暫停</button>
              ) : state.status === 'paused' ? (
                <button className="secondary-button" onClick={() => dispatch({ type: 'RESUME' })}><Play size={15} />繼續</button>
              ) : null}
              <button className="reset-button" onClick={startGame} aria-label="重新開始" title="重新開始"><RotateCcw size={16} /><span>重新開始</span></button>
            </div>
          </div>

          <GameBoard words={state.words} effects={state.effects} status={state.status} score={state.score} onStart={startGame} />
          <TypingInput
            value={state.input}
            disabled={state.status !== 'playing'}
            feedback={state.feedback}
            inputRef={inputRef}
            onChange={(value) => dispatch({ type: 'TYPE', value })}
          />
        </section>

        <footer className="page-footer"><span>TYPE FAST. STAY ALIVE.</span><span>每個正確單字 +10 分 <i /> 底線失守扣除 1 條生命</span></footer>
      </div>
    </main>
  );
}

import { Crosshair, Sparkles } from 'lucide-react';
import type { ClearEffect, FallingWord, GameStatus } from '../game/types';

interface GameBoardProps {
  words: FallingWord[];
  effects: ClearEffect[];
  status: GameStatus;
  score: number;
  onStart: () => void;
}

export default function GameBoard({ words, effects, status, score, onStart }: GameBoardProps) {
  return (
    <section className={`game-board ${status === 'playing' ? 'is-live' : ''}`} aria-label="英文單字掉落區域">
      <div className="board-topline"><span><span className="live-dot" /> LIVE FIELD</span><span>ZONE 01 / EARTH</span></div>
      <div className="target-line" />
      {words.map((word) => (
        <div
          className="falling-word"
          key={word.id}
          style={{ left: `${word.x}%`, top: `${word.y}%` }}
          aria-label={`單字 ${word.text}`}
        >
          {word.text}
        </div>
      ))}
      {effects.map((effect) => (
        <div
          className="clear-effect"
          key={effect.id}
          style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
          aria-hidden="true"
        >
          <Sparkles size={16} /> +10
        </div>
      ))}
      {status === 'ready' && (
        <div className="board-state board-intro">
          <span className="intro-icon"><Crosshair size={25} /></span>
          <p className="board-eyebrow">DEFEND THE NETWORK</p>
          <h2>準備好迎戰了嗎？</h2>
          <p className="board-description">在單字觸底前輸入它，守住你的最後防線。</p>
          <button className="primary-button intro-button" onClick={onStart}>開始生存挑戰 <span aria-hidden="true">↗</span></button>
          <span className="key-hint">輸入單字即可自動消除</span>
        </div>
      )}
      {status === 'paused' && (
        <div className="board-state pause-overlay"><span className="board-eyebrow">SYSTEM ON HOLD</span><h2>遊戲已暫停</h2><p className="board-description">深呼吸，準備好再繼續。</p></div>
      )}
      {status === 'over' && (
        <div className="board-state gameover-overlay">
          <span className="board-eyebrow danger-eyebrow">SIGNAL LOST</span>
          <h2>防線失守</h2>
          <p className="board-description">本次得分 <strong>{score.toLocaleString()}</strong>，再試一次挑戰最高紀錄。</p>
          <button className="primary-button intro-button" onClick={onStart}>重新開始 <span aria-hidden="true">↻</span></button>
        </div>
      )}
      {status === 'playing' && words.length === 0 && (
        <div className="waiting-state"><span className="scan-line" />訊號掃描中...</div>
      )}
      <div className="board-footer"><span>防線臨界點</span><span>{words.length.toString().padStart(2, '0')} INCOMING</span></div>
    </section>
  );
}

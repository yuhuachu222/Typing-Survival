import { Clock3, Heart, Trophy } from 'lucide-react';

interface StatsBarProps {
  score: number;
  lives: number;
  elapsed: number;
  bestScore: number;
}

function formatTime(seconds: number): string {
  const total = Math.floor(seconds);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export default function StatsBar({ score, lives, elapsed, bestScore }: StatsBarProps) {
  return (
    <section className="stats-bar" aria-label="遊戲狀態">
      <div className="stat-item score-stat">
        <span className="stat-icon"><Trophy size={17} /></span>
        <span className="stat-copy"><span className="stat-label">得分</span><strong>{score.toLocaleString()}</strong></span>
      </div>
      <div className="stat-item life-stat">
        <span className="stat-icon"><Heart size={17} /></span>
        <span className="stat-copy"><span className="stat-label">生命</span><strong className="life-count" aria-label={`剩餘 ${lives} 條生命`}>{'♥'.repeat(lives)}<span className="lost-lives">{'♡'.repeat(3 - lives)}</span></strong></span>
      </div>
      <div className="stat-item time-stat">
        <span className="stat-icon"><Clock3 size={17} /></span>
        <span className="stat-copy"><span className="stat-label">生存時間</span><strong>{formatTime(elapsed)}</strong></span>
      </div>
      <div className="stat-item best-stat">
        <span className="stat-icon"><Trophy size={17} /></span>
        <span className="stat-copy"><span className="stat-label">最高紀錄</span><strong>{bestScore.toLocaleString()}</strong></span>
      </div>
    </section>
  );
}

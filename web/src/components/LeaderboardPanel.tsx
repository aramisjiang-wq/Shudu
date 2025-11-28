import type { Difficulty, LeaderboardEntry } from '../types';
import { difficultyLabel } from '../services/sudoku';
import { formatDuration } from '../services/time';

interface Props {
  activeDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  items: LeaderboardEntry[];
  loading: boolean;
  onRefresh: () => void;
}

const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard'];

const LeaderboardPanel = ({ activeDifficulty, onSelectDifficulty, items, loading, onRefresh }: Props) => (
  <div className="leaderboard-panel">
    <div className="leaderboard-header">
      <h3>排行榜</h3>
      <button type="button" onClick={onRefresh} disabled={loading}>
        {loading ? '刷新中...' : '刷新'}
      </button>
    </div>
    <div className="leaderboard-tabs">
      {difficultyOrder.map((level) => (
        <button
          key={level}
          type="button"
          className={activeDifficulty === level ? 'active' : ''}
          onClick={() => onSelectDifficulty(level)}
        >
          {difficultyLabel[level]}
        </button>
      ))}
    </div>
    <div className="leaderboard-list">
      {loading && <p>载入榜单...</p>}
      {!loading && items.length === 0 && <p>暂无记录，成为首位征服者！</p>}
      {!loading &&
        items.map((entry, index) => (
          <div key={`${entry.displayName}-${entry.completedAt}-${index}`} className="leaderboard-row">
            <div>
              <strong>
                #{index + 1} {entry.displayName}
              </strong>
              <span>{new Date(entry.completedAt).toLocaleString()}</span>
            </div>
            <div className="leaderboard-stats">
              <span>用时 {formatDuration(entry.durationSeconds)}</span>
              <span>错误 {entry.mistakes}</span>
            </div>
          </div>
        ))}
    </div>
    <p className="leaderboard-hint">向上看，孤独世界的王座只属于最快且最稳的人。</p>
  </div>
);

export default LeaderboardPanel;





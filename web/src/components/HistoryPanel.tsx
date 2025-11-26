import type { HistoryItem } from '../types';
import { difficultyLabel } from '../services/sudoku';
import { formatDuration } from '../services/time';

interface Props {
  items: HistoryItem[];
}

const HistoryPanel = ({ items }: Props) => (
  <div className="history-panel">
    <div className="history-header">
      <h3>历史战绩</h3>
      <span>{items.length} 局</span>
    </div>
    <div className="history-list">
      {items.length === 0 && <p>暂无记录，快来挑战第一局！</p>}
      {items.map((item) => (
        <div key={item.id} className="history-row">
          <div>
            <strong>{difficultyLabel[item.difficulty]}</strong>
            <span>{new Date(item.completedAt).toLocaleString()}</span>
          </div>
          <div className="history-stats">
            <span>用时 {formatDuration(item.durationSeconds)}</span>
            <span>错误 {item.mistakes}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HistoryPanel;


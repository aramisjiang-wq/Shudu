import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel';
import SudokuBoard from './components/SudokuBoard';
import HistoryPanel from './components/HistoryPanel';
import LeaderboardPanel from './components/LeaderboardPanel';
import { useAuth } from './hooks/useAuth';
import { useTimer } from './hooks/useTimer';
import { GameAPI } from './services/api';
import type { Difficulty, HistoryItem, LeaderboardEntry, PuzzlePayload } from './types';
import { boardEquals, buildGivens, cloneBoard, computeConflicts, difficultyLabel } from './services/sudoku';
import { formatDuration } from './services/time';

const defaultBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));
const defaultNotes = () => Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Array(9).fill(false)));
const cloneNotes = (grid: boolean[][][]) => grid.map((row) => row.map((cell) => [...cell]));
type BoardInputPayload = { row: number; col: number; value: number | null; mode: 'value' | 'note' };

const difficultyMeta: Record<
  Difficulty,
  { label: string; tagline: string; maxMistakes: number; encouragement: string }
> = {
  easy: {
    label: '新手',
    tagline: '36-40 个提示位，允许 8 次尝试，轻松热身',
    maxMistakes: 8,
    encouragement: '先休息一下，孤独世界永远为你留灯。',
  },
  medium: {
    label: '进阶',
    tagline: '32-35 个提示位，允许 5 次尝试，逐步升级',
    maxMistakes: 5,
    encouragement: '再加一把劲，你已经离王国大门只有一步之遥。',
  },
  hard: {
    label: '专家',
    tagline: '28-31 个提示位，允许 3 次尝试，极限挑战',
    maxMistakes: 3,
    encouragement: '失败是荣耀的勋章，王子公主依旧在终点等你。',
  },
};

type FeedbackState =
  | { type: 'win'; message: string }
  | { type: 'encourage'; message: string };

const App = () => {
  const { user, status, error, authBusy, login, register, logout, clearError } = useAuth();
  const { seconds, running, start, pause, reset } = useTimer();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState<Difficulty>('medium');
  const [puzzle, setPuzzle] = useState<PuzzlePayload | null>(null);
  const [board, setBoard] = useState(defaultBoard);
  const [givens, setGivens] = useState(buildGivens(defaultBoard()));
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [notes, setNotes] = useState<boolean[][][]>(() => defaultNotes());
  const [noteMode, setNoteMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [loadingPuzzle, setLoadingPuzzle] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [leaderboard, setLeaderboard] = useState<Record<Difficulty, LeaderboardEntry[]>>({
    easy: [],
    medium: [],
    hard: [],
  });
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const conflicts = useMemo(() => computeConflicts(board), [board]);
  const numberCounts = useMemo(() => {
    const counts = Array(10).fill(0);
    board.forEach((row) =>
      row.forEach((value) => {
        if (value > 0) counts[value] += 1;
      })
    );
    return counts;
  }, [board]);
  const peerHighlights = useMemo(() => {
    if (!selected) return new Set<string>();
    const set = new Set<string>();
    for (let i = 0; i < 9; i += 1) {
      set.add(`${selected.row}-${i}`);
      set.add(`${i}-${selected.col}`);
    }
    const startRow = Math.floor(selected.row / 3) * 3;
    const startCol = Math.floor(selected.col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r += 1) {
      for (let c = startCol; c < startCol + 3; c += 1) {
        set.add(`${r}-${c}`);
      }
    }
    return set;
  }, [selected]);
  const sameValueHighlights = useMemo(() => {
    if (!selected) return new Set<string>();
    const value = board[selected.row][selected.col];
    if (!value) return new Set<string>();
    const set = new Set<string>();
    board.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === value) set.add(`${r}-${c}`);
      })
    );
    return set;
  }, [board, selected]);

  const activeMeta = difficultyMeta[difficulty];
  const leaderboardItems = leaderboard[leaderboardDifficulty] ?? [];

  const handleSelectDifficulty = (level: Difficulty) => {
    setDifficulty(level);
    setLeaderboardDifficulty(level);
  };

  const loadHistory = useCallback(async () => {
    if (!user) return;
    try {
      const items = await GameAPI.fetchHistory();
      setHistory(items);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const loadLeaderboard = useCallback(
    async (level: Difficulty) => {
      if (!user) return;
      setLeaderboardLoading(true);
      try {
        const items = await GameAPI.fetchLeaderboard(level);
        setLeaderboard((prev) => ({ ...prev, [level]: items }));
      } catch (err) {
        console.error(err);
      } finally {
        setLeaderboardLoading(false);
      }
    },
    [user]
  );

  const refreshLeaderboard = useCallback(() => {
    void loadLeaderboard(leaderboardDifficulty);
  }, [leaderboardDifficulty, loadLeaderboard]);

  const loadPuzzle = useCallback(
    async (level: Difficulty) => {
      if (!user) return;
      setLoadingPuzzle(true);
      setSelected(null);
      setMistakes(0);
      setNotes(defaultNotes());
      setNoteMode(false);
      setFeedback(null);
      setLocked(false);
      reset();
      setHasWon(false);
      setSubmitting(false);
      try {
        const next = await GameAPI.fetchPuzzle(level);
        setPuzzle(next);
        setBoard(cloneBoard(next.puzzle));
        setGivens(buildGivens(next.puzzle));
        start();
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPuzzle(false);
      }
    },
    [user, reset, start]
  );

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLeaderboard({ easy: [], medium: [], hard: [] });
      setLeaderboardDifficulty('medium');
      return;
    }
    loadHistory();
  }, [user, loadHistory]);

  useEffect(() => {
    if (!user) return;
    void loadLeaderboard(leaderboardDifficulty);
  }, [user, leaderboardDifficulty, loadLeaderboard]);

  useEffect(() => {
    if (!user) {
      const blank = defaultBoard();
      setPuzzle(null);
      setBoard(blank);
      setGivens(buildGivens(blank));
      setNotes(defaultNotes());
      setNoteMode(false);
      setSelected(null);
      setMistakes(0);
      setHasWon(false);
      setSubmitting(false);
      setLoadingPuzzle(false);
      setFeedback(null);
      setLocked(false);
      reset();
      return;
    }
    void loadPuzzle(difficulty);
  }, [user, difficulty, loadPuzzle, reset]);

  const clearNotesAt = (row: number, col: number) => {
    setNotes((prev) => {
      const next = cloneNotes(prev);
      next[row][col] = Array.from({ length: 9 }, () => false);
      return next;
    });
  };

  const commitValue = (row: number, col: number, value: number | null) => {
    if (!puzzle) return;
    if (givens[row][col]) return;
    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = value ?? 0;
      return next;
    });
    clearNotesAt(row, col);
    const correctValue = puzzle.solution[row][col];
    if (value && value !== correctValue) {
      setMistakes((prev) => {
        const next = prev + 1;
        if (next >= activeMeta.maxMistakes) {
          setLocked(true);
          pause();
          setFeedback({
            type: 'encourage',
            message: `你已经挑战到 ${activeMeta.label} 的极限啦！${activeMeta.encouragement}`,
          });
        }
        return next;
      });
    }
  };

  const toggleNote = (row: number, col: number, value: number) => {
    if (!puzzle) return;
    if (givens[row][col]) return;
    if (board[row][col] !== 0) return;
    setNotes((prev) => {
      const next = cloneNotes(prev);
      const cell = [...next[row][col]];
      cell[value - 1] = !cell[value - 1];
      next[row][col] = cell;
      return next;
    });
  };

  const handleBoardInput = (payload: BoardInputPayload) => {
    if (locked) return;
    const { row, col, value, mode } = payload;
    if (mode === 'note') {
      if (!value) return;
      toggleNote(row, col, value);
      return;
    }
    commitValue(row, col, value ?? null);
  };

  useEffect(() => {
    if (!puzzle) return;
    if (submitting || hasWon) return;
    if (boardEquals(board, puzzle.solution)) {
      setHasWon(true);
      setSubmitting(true);
      setLocked(true);
      setFeedback({
        type: 'win',
        message: `王子抱公主的荣耀时刻！你以 ${formatDuration(seconds)} 通关了 ${activeMeta.label} 难度，继续征服孤独世界吧。`,
      });
      pause();
      GameAPI.submitHistory({
        difficulty,
        durationSeconds: seconds,
        mistakes,
        puzzleSeed: puzzle.puzzleSeed,
        solutionSeed: puzzle.solutionSeed,
        boardSnapshot: board,
      })
        .then((item) => {
          setHistory((prev) => [item, ...prev]);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  }, [board, puzzle, seconds, mistakes, difficulty, submitting, hasWon, pause]);

  const ready = status === 'ready';

  if (!ready) {
    return (
      <div className="loading-screen">
        <h2>加载中…</h2>
      </div>
    );
  }

  if (!user) {
    return <AuthPanel onLogin={login} onRegister={register} busy={authBusy} error={error} clearError={clearError} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>数独的孤独世界（快来play我）</h1>
          <p>
            欢迎回来，<strong>{user.displayName}</strong>
          </p>
        </div>
        <div className="header-actions">
          <span>累计历史 {history.length} 局</span>
          <button type="button" onClick={logout}>
            退出登录
          </button>
        </div>
      </header>
      <main className="dashboard">
        <section className="game-panel">
          <div className="game-toolbar">
            <div className="difficulty-selector">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={difficulty === level ? 'active' : ''}
                  onClick={() => handleSelectDifficulty(level)}
                  disabled={loadingPuzzle}
                >
                  {difficultyLabel[level]}
                </button>
              ))}
            </div>
            <div className="timer">
              <span>用时 {formatDuration(seconds)}</span>
              <button type="button" onClick={running ? pause : start}>
                {running ? '暂停' : '继续'}
              </button>
              <button type="button" onClick={() => loadPuzzle(difficulty)} disabled={loadingPuzzle}>
                换一局
              </button>
            </div>
            <div className="note-mode-toggle">
              <button type="button" className={noteMode ? 'active' : ''} onClick={() => setNoteMode((prev) => !prev)}>
                草稿模式：{noteMode ? '开' : '关'}
              </button>
              <span>Shift + 数字 或 N 键快速切换</span>
            </div>
          </div>
          <div className="difficulty-meta">
            <strong>{activeMeta.label} · 错误上限 {activeMeta.maxMistakes}</strong>
            <p>{activeMeta.tagline}</p>
          </div>
          <div className="game-meta">
            <span>错误次数：{mistakes}</span>
            <span className={noteMode ? 'note-active' : ''}>草稿模式 {noteMode ? '开启' : '关闭'}</span>
            {submitting && <span>保存战绩中...</span>}
            {loadingPuzzle && <span>生成新题...</span>}
          </div>
          <SudokuBoard
            board={board}
            givens={givens}
            notes={notes}
            selected={selected}
            setSelected={setSelected}
            onInput={handleBoardInput}
            noteMode={noteMode}
            numberCounts={numberCounts}
            conflicts={conflicts}
            peerHighlights={peerHighlights}
            sameValueHighlights={sameValueHighlights}
            onToggleNoteMode={() => setNoteMode((prev) => !prev)}
            disabled={loadingPuzzle || locked}
          />
        </section>
        <aside className="side-panels">
          <HistoryPanel items={history} />
          <LeaderboardPanel
            activeDifficulty={leaderboardDifficulty}
            onSelectDifficulty={setLeaderboardDifficulty}
            items={leaderboardItems}
            loading={leaderboardLoading}
            onRefresh={refreshLeaderboard}
          />
        </aside>
      </main>
      {feedback && (
        <div className={`feedback-overlay ${feedback.type}`}>
          <div className="feedback-card">
            <h3>{feedback.type === 'win' ? '🎉 王子抱公主 🎉' : '🌈 孤独世界抱抱 🌈'}</h3>
            <p>{feedback.message}</p>
            <button
              type="button"
              onClick={() => {
                setFeedback(null);
                void loadPuzzle(difficulty);
              }}
            >
              再战一局
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


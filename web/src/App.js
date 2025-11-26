import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel';
import SudokuBoard from './components/SudokuBoard';
import HistoryPanel from './components/HistoryPanel';
import LeaderboardPanel from './components/LeaderboardPanel';
import { useAuth } from './hooks/useAuth';
import { useTimer } from './hooks/useTimer';
import { GameAPI } from './services/api';
import { boardEquals, buildGivens, cloneBoard, computeConflicts, difficultyLabel } from './services/sudoku';
import { formatDuration } from './services/time';
const defaultBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));
const defaultNotes = () => Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Array(9).fill(false)));
const cloneNotes = (grid) => grid.map((row) => row.map((cell) => [...cell]));
const difficultyMeta = {
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
const App = () => {
    const { user, status, error, authBusy, login, register, logout, clearError } = useAuth();
    const { seconds, running, start, pause, reset } = useTimer();
    const [history, setHistory] = useState([]);
    const [difficulty, setDifficulty] = useState('medium');
    const [leaderboardDifficulty, setLeaderboardDifficulty] = useState('medium');
    const [puzzle, setPuzzle] = useState(null);
    const [board, setBoard] = useState(defaultBoard);
    const [givens, setGivens] = useState(buildGivens(defaultBoard()));
    const [selected, setSelected] = useState(null);
    const [notes, setNotes] = useState(() => defaultNotes());
    const [noteMode, setNoteMode] = useState(false);
    const [mistakes, setMistakes] = useState(0);
    const [loadingPuzzle, setLoadingPuzzle] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [locked, setLocked] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [leaderboard, setLeaderboard] = useState({
        easy: [],
        medium: [],
        hard: [],
    });
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const conflicts = useMemo(() => computeConflicts(board), [board]);
    const numberCounts = useMemo(() => {
        const counts = Array(10).fill(0);
        board.forEach((row) => row.forEach((value) => {
            if (value > 0)
                counts[value] += 1;
        }));
        return counts;
    }, [board]);
    const peerHighlights = useMemo(() => {
        if (!selected)
            return new Set();
        const set = new Set();
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
        if (!selected)
            return new Set();
        const value = board[selected.row][selected.col];
        if (!value)
            return new Set();
        const set = new Set();
        board.forEach((row, r) => row.forEach((cell, c) => {
            if (cell === value)
                set.add(`${r}-${c}`);
        }));
        return set;
    }, [board, selected]);
    const activeMeta = difficultyMeta[difficulty];
    const leaderboardItems = leaderboard[leaderboardDifficulty] ?? [];
    const handleSelectDifficulty = (level) => {
        setDifficulty(level);
        setLeaderboardDifficulty(level);
    };
    const loadHistory = useCallback(async () => {
        if (!user)
            return;
        try {
            const items = await GameAPI.fetchHistory();
            setHistory(items);
        }
        catch (err) {
            console.error(err);
        }
    }, [user]);
    const loadLeaderboard = useCallback(async (level) => {
        if (!user)
            return;
        setLeaderboardLoading(true);
        try {
            const items = await GameAPI.fetchLeaderboard(level);
            setLeaderboard((prev) => ({ ...prev, [level]: items }));
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLeaderboardLoading(false);
        }
    }, [user]);
    const refreshLeaderboard = useCallback(() => {
        void loadLeaderboard(leaderboardDifficulty);
    }, [leaderboardDifficulty, loadLeaderboard]);
    const loadPuzzle = useCallback(async (level) => {
        if (!user)
            return;
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
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoadingPuzzle(false);
        }
    }, [user, reset, start]);
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
        if (!user)
            return;
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
    const clearNotesAt = (row, col) => {
        setNotes((prev) => {
            const next = cloneNotes(prev);
            next[row][col] = Array.from({ length: 9 }, () => false);
            return next;
        });
    };
    const commitValue = (row, col, value) => {
        if (!puzzle)
            return;
        if (givens[row][col])
            return;
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
    const toggleNote = (row, col, value) => {
        if (!puzzle)
            return;
        if (givens[row][col])
            return;
        if (board[row][col] !== 0)
            return;
        setNotes((prev) => {
            const next = cloneNotes(prev);
            const cell = [...next[row][col]];
            cell[value - 1] = !cell[value - 1];
            next[row][col] = cell;
            return next;
        });
    };
    const handleBoardInput = (payload) => {
        if (locked)
            return;
        const { row, col, value, mode } = payload;
        if (mode === 'note') {
            if (!value)
                return;
            toggleNote(row, col, value);
            return;
        }
        commitValue(row, col, value ?? null);
    };
    useEffect(() => {
        if (!puzzle)
            return;
        if (submitting || hasWon)
            return;
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
        return (_jsx("div", { className: "loading-screen", children: _jsx("h2", { children: "\u52A0\u8F7D\u4E2D\u2026" }) }));
    }
    if (!user) {
        return _jsx(AuthPanel, { onLogin: login, onRegister: register, busy: authBusy, error: error, clearError: clearError });
    }
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "app-header", children: [_jsxs("div", { children: [_jsx("h1", { children: "\u6570\u72EC\u7684\u5B64\u72EC\u4E16\u754C\uFF08\u5FEB\u6765play\u6211\uFF09" }), _jsxs("p", { children: ["\u6B22\u8FCE\u56DE\u6765\uFF0C", _jsx("strong", { children: user.displayName })] })] }), _jsxs("div", { className: "header-actions", children: [_jsxs("span", { children: ["\u7D2F\u8BA1\u5386\u53F2 ", history.length, " \u5C40"] }), _jsx("button", { type: "button", onClick: logout, children: "\u9000\u51FA\u767B\u5F55" })] })] }), _jsxs("main", { className: "dashboard", children: [_jsxs("section", { className: "game-panel", children: [_jsxs("div", { className: "game-toolbar", children: [_jsx("div", { className: "difficulty-selector", children: ['easy', 'medium', 'hard'].map((level) => (_jsx("button", { type: "button", className: difficulty === level ? 'active' : '', onClick: () => handleSelectDifficulty(level), disabled: loadingPuzzle, children: difficultyLabel[level] }, level))) }), _jsxs("div", { className: "timer", children: [_jsxs("span", { children: ["\u7528\u65F6 ", formatDuration(seconds)] }), _jsx("button", { type: "button", onClick: running ? pause : start, children: running ? '暂停' : '继续' }), _jsx("button", { type: "button", onClick: () => loadPuzzle(difficulty), disabled: loadingPuzzle, children: "\u6362\u4E00\u5C40" })] }), _jsxs("div", { className: "note-mode-toggle", children: [_jsxs("button", { type: "button", className: noteMode ? 'active' : '', onClick: () => setNoteMode((prev) => !prev), children: ["\u8349\u7A3F\u6A21\u5F0F\uFF1A", noteMode ? '开' : '关'] }), _jsx("span", { children: "Shift + \u6570\u5B57 \u6216 N \u952E\u5FEB\u901F\u5207\u6362" })] })] }), _jsxs("div", { className: "difficulty-meta", children: [_jsxs("strong", { children: [activeMeta.label, " \u00B7 \u9519\u8BEF\u4E0A\u9650 ", activeMeta.maxMistakes] }), _jsx("p", { children: activeMeta.tagline })] }), _jsxs("div", { className: "game-meta", children: [_jsxs("span", { children: ["\u9519\u8BEF\u6B21\u6570\uFF1A", mistakes] }), _jsxs("span", { className: noteMode ? 'note-active' : '', children: ["\u8349\u7A3F\u6A21\u5F0F ", noteMode ? '开启' : '关闭'] }), submitting && _jsx("span", { children: "\u4FDD\u5B58\u6218\u7EE9\u4E2D..." }), loadingPuzzle && _jsx("span", { children: "\u751F\u6210\u65B0\u9898..." })] }), _jsx(SudokuBoard, { board: board, givens: givens, notes: notes, selected: selected, setSelected: setSelected, onInput: handleBoardInput, noteMode: noteMode, numberCounts: numberCounts, conflicts: conflicts, peerHighlights: peerHighlights, sameValueHighlights: sameValueHighlights, onToggleNoteMode: () => setNoteMode((prev) => !prev), disabled: loadingPuzzle || locked })] }), _jsxs("aside", { className: "side-panels", children: [_jsx(HistoryPanel, { items: history }), _jsx(LeaderboardPanel, { activeDifficulty: leaderboardDifficulty, onSelectDifficulty: setLeaderboardDifficulty, items: leaderboardItems, loading: leaderboardLoading, onRefresh: refreshLeaderboard })] })] }), feedback && (_jsx("div", { className: `feedback-overlay ${feedback.type}`, children: _jsxs("div", { className: "feedback-card", children: [_jsx("h3", { children: feedback.type === 'win' ? '🎉 王子抱公主 🎉' : '🌈 孤独世界抱抱 🌈' }), _jsx("p", { children: feedback.message }), _jsx("button", { type: "button", onClick: () => {
                                setFeedback(null);
                                void loadPuzzle(difficulty);
                            }, children: "\u518D\u6218\u4E00\u5C40" })] }) }))] }));
};
export default App;

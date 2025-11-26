import { Difficulty } from '../types.js';

const SIZE = 9;
const BOX = 3;

type Board = number[][];

const DIFFICULTY_TO_CLUES: Record<Difficulty, [number, number]> = {
  easy: [36, 40],
  medium: [32, 35],
  hard: [28, 31],
};

const range = Array.from({ length: SIZE }, (_, i) => i);

const createEmptyBoard = (): Board => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const isSafe = (board: Board, row: number, col: number, num: number) => {
  for (let i = 0; i < SIZE; i += 1) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = row - (row % BOX);
  const startCol = col - (col % BOX);
  for (let r = 0; r < BOX; r += 1) {
    for (let c = 0; c < BOX; c += 1) {
      if (board[startRow + r][startCol + c] === num) return false;
    }
  }
  return true;
};

const shuffle = <T,>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

const fillBoard = (board: Board): boolean => {
  for (const row of range) {
    for (const col of range) {
      if (board[row][col] === 0) {
        for (const num of shuffle(range.map((x) => x + 1))) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const copyBoard = (board: Board): Board => board.map((row) => [...row]);

const countSolutions = (board: Board, limit = 2): number => {
  for (const row of range) {
    for (const col of range) {
      if (board[row][col] === 0) {
        let solutions = 0;
        for (const num of range.map((x) => x + 1)) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            solutions += countSolutions(board, limit);
            board[row][col] = 0;
            if (solutions >= limit) return solutions;
          }
        }
        return solutions;
      }
    }
  }
  return 1;
};

const boardToSeed = (board: Board): string => board.flat().join('');

const seedToBoard = (seed: string): Board => {
  const board = createEmptyBoard();
  for (let i = 0; i < seed.length; i += 1) {
    const row = Math.floor(i / SIZE);
    const col = i % SIZE;
    board[row][col] = Number(seed[i]);
  }
  return board;
};

const carveCells = (board: Board, difficulty: Difficulty): Board => {
  const [minClues, maxClues] = DIFFICULTY_TO_CLUES[difficulty];
  const targetClues = Math.floor(Math.random() * (maxClues - minClues + 1)) + minClues;
  const cells = range.flatMap((r) => range.map((c) => [r, c]));
  const shuffled = shuffle(cells.map(([r, c]) => ({ r, c })));
  const puzzle = copyBoard(board);
  let removed = SIZE * SIZE - targetClues;

  for (const { r, c } of shuffled) {
    if (removed <= 0) break;
    const backup = puzzle[r][c];
    if (backup === 0) continue;
    puzzle[r][c] = 0;
    const snapshot = copyBoard(puzzle);
    if (countSolutions(snapshot) !== 1) {
      puzzle[r][c] = backup;
    } else {
      removed -= 1;
    }
  }
  return puzzle;
};

const solveBoard = (board: Board): boolean => {
  for (const row of range) {
    for (const col of range) {
      if (board[row][col] === 0) {
        for (const num of range.map((x) => x + 1)) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const generatePuzzle = (difficulty: Difficulty) => {
  const solution = createEmptyBoard();
  fillBoard(solution);
  const puzzle = carveCells(solution, difficulty);
  return {
    puzzle,
    solution,
    puzzleSeed: boardToSeed(puzzle),
    solutionSeed: boardToSeed(solution),
  };
};

export const seedToPuzzle = (seed: string) => seedToBoard(seed);

export const solveFromSeed = (seed: string) => {
  const board = seedToBoard(seed);
  const solved = copyBoard(board);
  if (!solveBoard(solved)) {
    throw new Error('Puzzle seed not solvable');
  }
  return boardToSeed(solved);
};


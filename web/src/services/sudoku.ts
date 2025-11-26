import type { Difficulty } from '../types';

export type Board = number[][];

export const cloneBoard = (board: Board) => board.map((row) => [...row]);

export const buildGivens = (puzzle: Board) =>
  puzzle.map((row) => row.map((cell) => cell !== 0));

const key = (r: number, c: number) => `${r}-${c}`;

export const computeConflicts = (board: Board) => {
  const conflicts = new Set<string>();
  for (let i = 0; i < 9; i += 1) {
    const seenRow = new Map<number, number>();
    const seenCol = new Map<number, number>();
    for (let j = 0; j < 9; j += 1) {
      const rowVal = board[i][j];
      const colVal = board[j][i];
      if (rowVal !== 0) {
        if (seenRow.has(rowVal)) {
          conflicts.add(key(i, j));
          conflicts.add(key(i, seenRow.get(rowVal)!));
        } else {
          seenRow.set(rowVal, j);
        }
      }
      if (colVal !== 0) {
        if (seenCol.has(colVal)) {
          conflicts.add(key(j, i));
          conflicts.add(key(seenCol.get(colVal)!, i));
        } else {
          seenCol.set(colVal, j);
        }
      }
    }
  }
  for (let br = 0; br < 3; br += 1) {
    for (let bc = 0; bc < 3; bc += 1) {
      const seen = new Map<number, [number, number]>();
      for (let r = 0; r < 3; r += 1) {
        for (let c = 0; c < 3; c += 1) {
          const row = br * 3 + r;
          const col = bc * 3 + c;
          const value = board[row][col];
          if (value === 0) continue;
          if (seen.has(value)) {
            const [r2, c2] = seen.get(value)!;
            conflicts.add(key(row, col));
            conflicts.add(key(r2, c2));
          } else {
            seen.set(value, [row, col]);
          }
        }
      }
    }
  }
  return conflicts;
};

export const boardEquals = (board: Board, solution: Board) => {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
};

export const difficultyLabel: Record<Difficulty, string> = {
  easy: '新手',
  medium: '进阶',
  hard: '专家',
};


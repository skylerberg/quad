import type { Tile } from './tile';
import type { Level } from './level';
import { evaluate } from './goal';

export function checkPuzzle(level: Level, board: Array<Array<Tile | null>>): boolean | null {
  let result: boolean | null = true;
  for (const [index, row] of board.entries()) {
    const evaluation = evaluate(level.rowGoals[index], row);
    if (evaluation === false) {
      return false;
    }
    if (evaluation === null) {
      result = null;
    }
  }

  const columns = [
    [board[0][0], board[1][0], board[2][0], board[3][0]],
    [board[0][1], board[1][1], board[2][1], board[3][1]],
    [board[0][2], board[1][2], board[2][2], board[3][2]],
    [board[0][3], board[1][3], board[2][3], board[3][3]],
  ];
  for (const [index, column] of columns.entries()) {
    const evaluation = evaluate(level.colGoals[index], column);
    if (evaluation === false) {
      return false;
    }
    if (evaluation === null) {
      result = null;
    }
  }

  return result;
}

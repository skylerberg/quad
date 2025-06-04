import { evaluate, type Goal } from './goal';
import type { Tile, Rank, Suit } from './tile';
import { red, blue, green, white } from './tile';

export type Difficulty = 'Tutorial1' | 'Tutorial2' | 'Tutorial3' | 'Casual' | 'Challenge' | 'Extreme';

export type Space = {
  row: number,
  col: number,
};

export type Action = {
  type: 'swap',
  first: Space,
  second: Space,
} | {
  type: 'place',
  tile: Tile,
  space: Space,
} | {
  type: 'remove',
  tile: Tile | undefined,
  space: Space,
};

export class Puzzle {
  rowGoals: Array<Goal>;
  colGoals: Array<Goal>;
  id: string;  // An unchanging ID we use to uniquely identify puzzles for sessionStorage
  section: 'Tutorial' | 'Floral' | 'Elemental' | 'Celestial';
  board: Array<Array<Tile | null>> = $state([]);
  actionHistory: Array<Action> = $state([]);
  historyPosition: number = $state(0);
  redoAvailable: boolean = $derived(this.actionHistory.length > this.historyPosition)
  undoAvailable: boolean = $derived(this.historyPosition > 0)

  constructor({goals, hints}: {goals: string, hints: string}) {
    //this.actionHistory = $state([]);
    //this.historyPosition = $state(0);
    //this.board = $state([])
    this.id = goals;
    this.section = 'Floral';
    this.colGoals = [
      goalFromString(goals.slice(0, 4)),
      goalFromString(goals.slice(4, 8)),
      goalFromString(goals.slice(8, 12)),
      goalFromString(goals.slice(12, 16)),
    ];
    this.rowGoals = [
      goalFromString(goals.slice(16, 20)),
      goalFromString(goals.slice(20, 24)),
      goalFromString(goals.slice(24, 28)),
      goalFromString(goals.slice(28, 32)),
    ];
    for (let row = 0; row < 4; row++) {
      this.board.push([]);
      for (let col = 0; col < 4; col++) {
        this.board[row].push(null);
      }
    }
    if (hints) {
      for (let i = 0; i < hints.length; i += 4) {
        let hint = hints.slice(i, i + 4);
        let row = Number.parseInt(hint[0]);
        let col = Number.parseInt(hint[1]);
        let suit = hint[2] as Suit;
        let rank = Number.parseInt(hint[3]) as Rank;
        this.board[row][col] = { suit, rank, locked: true };
      }
    }
  }

  private isLocked(row: number, col: number): boolean {
    return !!this.board[row][col]?.locked;
  }

  redoIsAvailable(): boolean {
    return this.actionHistory.length > this.historyPosition;
  }

  undoIsAvailable(): boolean {
    return this.historyPosition > 0;
  }

  do(action: Action) {
    console.log(action);
    if (action.type === 'swap') {
      this.swapBoardSpaces(action.first, action.second);
    }
    else if (action.type === 'place') {
      this.placeOnBoard(action.space.row, action.space.col, action.tile);
    }
    else if (action.type === 'remove') {
      const tile = this.removeFromBoard(action.space.row, action.space.col);
      if (tile) {
        action.tile = tile;
      }
    }
    if (this.actionHistory.length > this.historyPosition) {
      this.actionHistory.splice(this.historyPosition);
    }
    this.actionHistory.push(action);
    this.historyPosition += 1;
  }

  undo() {
    this.historyPosition -= 1;
    const action = this.actionHistory[this.historyPosition];

    if (action.type === 'swap') {
      this.swapBoardSpaces(action.second, action.first);
    }
    else if (action.type === 'place') {
      this.removeFromBoard(action.space.row, action.space.col);
    }
    else if (action.type === 'remove') {
      if (action.tile) {
        this.placeOnBoard(action.space.row, action.space.col, action.tile);
      }
    }
  }

  redo() {
    const action = this.actionHistory[this.historyPosition];
    this.historyPosition += 1;

    if (action.type === 'swap') {
      this.swapBoardSpaces(action.first, action.second);
    }
    else if (action.type === 'place') {
      this.placeOnBoard(action.space.row, action.space.col, action.tile);
    }
    else if (action.type === 'remove') {
      const tile = this.removeFromBoard(action.space.row, action.space.col);
      if (tile) {
        action.tile = tile;
      }
    }
  }

  private removeFromBoard(row: number, col: number): Tile | null | undefined {
    if (!this.isLocked(row, col)) {
      const tile = this.board[row][col];
      this.board[row][col] = null;
      return tile;
    }
  }

  private placeOnBoard(row: number, col: number, tile: Tile) {
    if (!this.isLocked(row, col)) {
      this.board[row][col] = tile;
    }
  }

  private swapBoardSpaces(first: {row: number, col: number}, second: {row: number, col: number}) {
    if (!this.isLocked(first.row, first.col) && !this.isLocked(second.row, second.col)) {
      const fromTile = this.board[first.row][first.col];
      this.board[first.row][first.col] = this.board[second.row][second.col];
      this.board[second.row][second.col] = fromTile;
    }
  }

  check(): boolean | null {
    let result: boolean | null = true;
    for (const [index, row] of this.board.entries()) {
      const evaluation = evaluate(this.rowGoals[index], row);
      if (evaluation === false) {
        return false;
      }
      if (evaluation === null) {
        result = null;
      }
    }

    const columns = [
      [this.board[0][0], this.board[1][0], this.board[2][0], this.board[3][0]],
      [this.board[0][1], this.board[1][1], this.board[2][1], this.board[3][1]],
      [this.board[0][2], this.board[1][2], this.board[2][2], this.board[3][2]],
      [this.board[0][3], this.board[1][3], this.board[2][3], this.board[3][3]],
    ];
    for (const [index, column] of columns.entries()) {
      const evaluation = evaluate(this.colGoals[index], column);
      if (evaluation === false) {
        return false;
      }
      if (evaluation === null) {
        result = null;
      }
    }

    if (this.board.some(row => row.some(space => !space))) {
      return null;
    }

    return result;
  }
};

const goalFromString = (str: string): Goal => {
  let suits: Array<Suit> = [];
  let ranks: Array<Rank> = [];
  for (let char of str) {
    const goalPart = goalPartFromString(char);
    if (goalPart == blue || goalPart == green || goalPart == red || goalPart == white) {
      suits.push(goalPart as Suit);
    }
    else {
      ranks.push(goalPart as Rank);
    }
  }
  ranks.sort();
  suits.sort();
  return { suits, ranks}
}

const goalPartFromString = (str: string): Rank | Suit => {
  if (str == 'b') return blue;
  if (str == 'g') return green;
  if (str == 'r') return red;
  if (str == 'w') return white;
  if (str == '1') return 1;
  if (str == '2') return 2;
  if (str == '3') return 3;
  if (str == '4') return 4;
  throw new Error("invalid character for goal part");
}

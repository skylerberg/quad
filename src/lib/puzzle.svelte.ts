import { evaluate, type Goal } from './goal';
import type { Tile, Rank, Suit } from './tile';
import { red, blue, green, white, tilesAreEqual } from './tile';

export type Difficulty = 'Tutorial1' | 'Tutorial2' | 'Tutorial3' | 'Casual' | 'Challenge' | 'Expert';

export type Space = {
  row: number,
  col: number,
};

export type Action = {
  type: 'swap',
  first: Space,
  second: Space,
} | {
  type: 'swap-bag',
  boardTile?: Tile,
  bagTile: Tile,
  space: Space,
} | {
  type: 'place',
  tile: Tile,
  space: Space,
} | {
  type: 'remove',
  tile?: Tile,
  space: Space,
};

export type Change = Action | {
  type: 'undo',
  action: Action,
} | {
  type: 'redo',
  action: Action,
} | {
  type: 'select',
  tile: Tile,
} | {
  type: 'deselect',
  tile: Tile,
} | {
  type: 'reset',
}

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
  selectedTile: Tile | undefined = $state(undefined)
  changeListeners: Array<(change: Change) => void> = []

  constructor({goals, hints}: {goals: string, hints: string}) {
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

  do(action: Action) {
    let actionSucceeded = false;
    if (action.type === 'swap') {
      if (
        !this.isLocked(action.first.row, action.first.col)
          && !this.isLocked(action.second.row, action.second.col)
          && (action.first.row !== action.second.row
            || action.first.col !== action.second.col)
      ) {
        this.swapBoardSpaces(action.first, action.second);
        actionSucceeded = true;
      }
    }
    if (action.type === 'swap-bag') {
      if (!this.isLocked(action.space.row, action.space.col)) {
        const tile = this.removeFromBoard(action.space.row, action.space.col);
        this.placeOnBoard(action.space.row, action.space.col, action.bagTile);
        if (tile) {
          action.boardTile = tile;
        }
        actionSucceeded = true;
      }
    }
    else if (action.type === 'place') {
      if (!this.isLocked(action.space.row, action.space.col)) {
        this.placeOnBoard(action.space.row, action.space.col, action.tile);
        actionSucceeded = true;
      }
    }
    else if (action.type === 'remove') {
      if (!this.isLocked(action.space.row, action.space.col)) {
        const tile = this.removeFromBoard(action.space.row, action.space.col);
        if (tile) {
          action.tile = tile;
        }
        actionSucceeded = true;
      }
    }

    if (actionSucceeded) {
      this.boardcastChange(action);

      if (this.actionHistory.length > this.historyPosition) {
        this.actionHistory.splice(this.historyPosition);
      }

      this.actionHistory.push(action);
      this.historyPosition += 1;

      this.selectedTile = undefined;
    }
  }

  undo() {
    this.historyPosition -= 1;
    const action = this.actionHistory[this.historyPosition];

    if (action.type === 'swap') {
      this.swapBoardSpaces(action.second, action.first);
    }
    if (action.type === 'swap-bag') {
      this.removeFromBoard(action.space.row, action.space.col);
      this.placeOnBoard(action.space.row, action.space.col, action.boardTile);
    }
    else if (action.type === 'place') {
      this.removeFromBoard(action.space.row, action.space.col);
    }
    else if (action.type === 'remove') {
      if (action.tile) {
        this.placeOnBoard(action.space.row, action.space.col, action.tile);
      }
    }

    this.boardcastChange({type: 'undo', action});
  }

  redo() {
    const action = this.actionHistory[this.historyPosition];
    this.historyPosition += 1;

    if (action.type === 'swap') {
      this.swapBoardSpaces(action.first, action.second);
    }
    if (action.type === 'swap-bag') {
      this.removeFromBoard(action.space.row, action.space.col);
      this.placeOnBoard(action.space.row, action.space.col, action.bagTile);
    }
    else if (action.type === 'place') {
      this.placeOnBoard(action.space.row, action.space.col, action.tile);
    }
    else if (action.type === 'remove') {
      this.removeFromBoard(action.space.row, action.space.col);
    }

    this.boardcastChange({type: 'redo', action});
  }

  private removeFromBoard(row: number, col: number): Tile | null | undefined {
    const tile = this.board[row][col];
    this.board[row][col] = null;
    return tile;
  }

  private placeOnBoard(row: number, col: number, tile: Tile) {
    this.board[row][col] = tile;
  }

  private swapBoardSpaces(first: {row: number, col: number}, second: {row: number, col: number}) {
    const fromTile = this.board[first.row][first.col];
    this.board[first.row][first.col] = this.board[second.row][second.col];
    this.board[second.row][second.col] = fromTile;
  }

  selectTile(tile: Tile | undefined) {
    if (this.selectedTile) {
      if (tilesAreEqual(this.selectedTile, tile) || tile === undefined) {
        this.boardcastChange({type: 'deselect', tile: this.selectedTile});
        this.selectedTile = undefined; // Toggle selection
      }
      else {
        const clickedTileLocation = this.findTile(tile);
        const currentlySelectedTileLocation = this.findTile(this.selectedTile);
        if (currentlySelectedTileLocation === 'bag' && clickedTileLocation === 'bag') {
          this.selectedTile = tile;
          this.boardcastChange({type: 'select', tile: this.selectedTile});
        }
        else if (currentlySelectedTileLocation === 'bag' && clickedTileLocation !== 'bag') {
          this.do({
            type: 'swap-bag',
            space: clickedTileLocation,
            bagTile: this.selectedTile,
          });
        }
        else if (currentlySelectedTileLocation !== 'bag' && clickedTileLocation === 'bag') {
          this.do({
            type: 'swap-bag',
            space: currentlySelectedTileLocation,
            bagTile: tile,
          });
        }
        else { // both are on the board
          this.do({
            type: 'swap',
            first: currentlySelectedTileLocation,
            second: clickedTileLocation,
          });
        }
      }
    }
    else {
      if (tile) {
        this.boardcastChange({type: 'select', tile});
      }
      else {
        this.boardcastChange({type: 'deselect', tile: this.selectedTile});
      }
      this.selectedTile = tile;
    }
  }

  selectSpace(space: Space) {
    if (this.selectedTile) {
      const selectedTileLocation = this.findTile(this.selectedTile);
      if (selectedTileLocation === 'bag') {
        this.do({
          type: 'place',
          tile: this.selectedTile,
          space,
        });
      }
      else {
        this.do({
          type: 'swap',
          first: selectedTileLocation,
          second: space,
        });
      }
    }
  }

  selectTileBag() {
    if (this.selectedTile) {
      const selectedTileLocation = this.findTile(this.selectedTile);
      if (selectedTileLocation === 'bag') {
        this.boardcastChange({type: 'deselect', tile: this.selectedTile});
        this.selectedTile = undefined;
      }
      else {
        this.do({
          type: 'remove',
          space: selectedTileLocation,
        });
      }
    }
  }

  private findTile(tile: Tile): Space | 'bag' {
    for (let [rowIndex, row] of this.board.entries()) {
      for (let [colIndex, space] of row.entries()) {
        if (tilesAreEqual(tile, space)) {
          return { row: rowIndex, col: colIndex };
        }
      }
    }
    return 'bag';
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

  reset() {
    for (const row of this.board) {
      for (const [colIndex, tile] of row.entries()) {
        if (tile && !tile.locked) {
          row[colIndex] = null;
        }
      }
    }
    this.actionHistory = [];
    this.historyPosition = 0;
  }

  registerListener(callback: (change: Change) => void) {
    this.changeListeners.push(callback);
  }

  boardcastChange(change: Change) {
    for (let callback of this.changeListeners) {
      callback(change);
    }
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

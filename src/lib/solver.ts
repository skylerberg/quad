import type { Tile, TileValue } from './tile.ts';
import type { Suit } from './suit.ts';
import type { Level } from './level.ts';
import type { Condition } from './condition.ts';
import { allSuits } from './suit';
import { tilesAreEqual } from './tile';
import { evaluate } from './condition';

function tileMatches(tile: Tile | undefined, criteria: Partial<Tile>): boolean {
  if (tile === undefined) {
    return false;
  }
  if (criteria.suit && criteria.value) {
    return tile.value === criteria.value && tile.suit === criteria.suit;
  }
  else if (criteria.suit) {
    return tile.suit === criteria.suit;
  }
  else if (criteria.value) {
    return tile.value === criteria.value;
  }
  return false;
}

function conditionRequirementCountForCriteria(condition: Condition, criteria: Partial<Tile>): number {
  if (condition.type === 'ContainSuits' && criteria.suit) {
    return condition.suits.filter(suit => suit === criteria.suit).length;
  }
  if (condition.type === 'ContainNumbers' && criteria.value) {
    return condition.numbers.filter(number => number === criteria.value).length;
  }
  return 0;
}

const allNumbers = [1, 2, 3, 4];
const allCriteria: Array<Partial<Tile>> = allSuits.map(
  suit => ({suit} as Partial<Tile>)
).concat(
  allNumbers.map(value => ({value} as Partial<Tile>))
);

export function solve(level: Level): Array<Array<Tile | undefined>> | undefined {
  const rows: Array<Array<Tile | undefined>> = [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ];
  const values: Array<TileValue> = [1, 2, 3, 4];
  const suits: Array<Suit> = allSuits;
  const tiles: Array<Tile> = [];
  for (const suit of suits) {
    for (const value of values) {
      tiles.push({suit, value});
    }
  }
  return solveInner(level, rows, tiles, 1);
}

function solveInner(level: Level, board: Array<Array<Tile | undefined>>, tiles: Array<Tile>, depth: number): Array<Array<Tile | undefined>> | undefined {
  const currentStatus = checkPuzzle(level, board);
  if (currentStatus === true) {
    return board;
  }
  else if (currentStatus === false) {
    return undefined;
  }
  outer_loop:
  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, space] of row.entries()) {
      if (space === undefined) {
        for (let i = tiles.length - 1; i >= 0; i--) {
          const tile = tiles.splice(i, 1)[0];
          board[rowIndex][colIndex] = tile;
          let solution = solveInner(level, board, tiles, depth + 1);
          if (solution) {
            return solution;
          }
          board[rowIndex][colIndex] = undefined;
          tiles.push(tile);
        }
        break outer_loop;
      }
    }
  }
}

function checkPuzzle(level: Level, board: Array<Array<Tile | undefined>>): boolean | null {
  let result: boolean | null = true;
  for (const [index, row] of board.entries()) {
    const evaluation = evaluate(level.rowConditions[index], row);
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
    const evaluation = evaluate(level.colConditions[index], column);
    if (evaluation === false) {
      return false;
    }
    if (evaluation === null) {
      result = null;
    }
  }

  return result;
}

export function tacticalSolver(level: Level): Array<Array<Tile | undefined>> | undefined {
  const rows: Array<Array<Tile | undefined>> = [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ];
  const values: Array<TileValue> = [1, 2, 3, 4];
  const suits: Array<Suit> = allSuits;

  const options: Array<Array<Array<Tile>>> = [
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
  ];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      for (const suit of suits) {
        for (const value of values) {
          options[i][j].push({suit, value});
        }
      }
    }
  }

  const tiles: Array<Tile> = [];
  for (const suit of suits) {
    for (const value of values) {
      tiles.push({suit, value});
    }
  }

  const tactics: Array<(
    level: Level,
    board: Array<Array<Tile | undefined>>,
    options: Array<Array<Array<Tile>>>,
    tiles: Array<Tile>,
  ) => boolean> = [
    conditionBasedElimination,
    nakedSingle,

    // TODO what do I name this concept?
    singleGroupLockIn,
    // TODO do the numbers version

    // Single Condition Segregation
    rowSuitSegregation,
    colSuitSegregation,
    rowNumberSegregation,
    colNumberSegregation,

    // Multiple Condition Segregation
    multiRowSuitSegregation,
    multiColSuitSegregation,
    multiRowNumberSegregation,
    multiColNumberSegregation,

    // Row + Col Condition Segregation
    // NOTE: I currently only have these doing 1 row and 1 col at a time
    multiRowAndColSuitSegregation,
    multiRowAndColNumberSegregation,

    hiddenSingle,

    nakedPair,

    // HiddenPair
    arbitraryGuess,
  ];

  let madeProgress = true;
  while(madeProgress && tiles.length > 0) {
    madeProgress = false;

    for (const tactic of tactics) {
      if (tactic(level, rows, options, tiles)) {
        madeProgress = true;
        break;
      }
    }
  }

  return rows
}

function arbitraryGuess(
  _: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === undefined) {
        console.log(i, j, 'Arbitrary Guess', options[i][j]);
        placeTile(board, options, tiles, options[i][j][0], i, j)
        return true;
      }
    }
  }
  return false;
}

function placeTile(
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
  tile: Tile,
  i: number,
  j: number,
) {
  board[i][j] = tile;
  options[i][j] = [];

  // Remove placed tile from our available tiles
  const tileIndex = tiles.findIndex((t) => tilesAreEqual(t, tile));
  tiles.splice(tileIndex, 1);

  // Remove placed tile from the list of options for each empty space
  for (let x = 0; x < options.length; x++) {
    for (let y = 0; y < options[x].length; y++) {
      options[x][y] = options[x][y].filter((t) => !tilesAreEqual(t, tile));
    }
  }
}

function nakedSingle(
  _: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === undefined && options[i][j].length === 1) {
        placeTile(board, options, tiles, options[i][j][0], i, j)
        console.log(i, j, 'nakedSingle');
        return true;
      }
    }
  }
  return false;
}

function conditionBasedElimination(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  _: Array<Tile>,
): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === undefined) {
        for (const option of options[i][j]) {
          board[i][j] = option;
          let placementViolatesCondition = checkPuzzle(level, board) === false;
          board[i][j] = undefined;
          if (placementViolatesCondition) {
            options[i][j] = options[i][j].filter((tile) => !tilesAreEqual(tile, option));
            return true;
          }
        }
      }
    }
  }
  return false;
}

function getGroups(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
): Array<[
  Array<Tile | undefined>,  // Spaces in group
  Array<Array<Tile>>,  // Options per space in group
  Condition,
  Partial<{ row: number, col: number }>,  // Group description
]> {
  const groups: Array<[
    Array<Tile | undefined>,
    Array<Array<Tile>>,
    Condition,
    Partial<{ row: number, col: number }>,
  ]> = [];

  for (const [i, row] of board.entries()) {
    groups.push([row, options[i], level.rowConditions[i], {row: i}]);
  }

  const columns = [
    [board[0][0], board[1][0], board[2][0], board[3][0]],
    [board[0][1], board[1][1], board[2][1], board[3][1]],
    [board[0][2], board[1][2], board[2][2], board[3][2]],
    [board[0][3], board[1][3], board[2][3], board[3][3]],
  ];

  const columnOptions = [
    [options[0][0], options[1][0], options[2][0], options[3][0]],
    [options[0][1], options[1][1], options[2][1], options[3][1]],
    [options[0][2], options[1][2], options[2][2], options[3][2]],
    [options[0][3], options[1][3], options[2][3], options[3][3]],
  ];

  for (const [i, column] of columns.entries()) {
    groups.push([column, columnOptions[i], level.colConditions[i], {col: i}]);
  }

  return groups;
}

function singleGroupLockIn(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  _: Array<Tile>,
): boolean {
  let madeProgress = false;

  for (const criteria of allCriteria) {
    for (const [group, groupOptions, condition, groupDescription] of getGroups(level, board, options)) {
      if (condition.type === 'ContainSuits') {
        const requiredMatchingTiles = conditionRequirementCountForCriteria(condition, criteria);
        const existingMatchingTiles = group.filter(tile => tileMatches(tile, criteria)).length;
        const openSpacesThatCanMatch = groupOptions.filter(
          spaceOptions => spaceOptions.some(option => tileMatches(option, criteria))
        ).length;

        if (openSpacesThatCanMatch == requiredMatchingTiles - existingMatchingTiles) {
          for (const spaceOptions of groupOptions) {
            if (spaceOptions.some(option => tileMatches(option, criteria))) {
              // In place filter as mentioned here: https://stackoverflow.com/a/49587869/3908710
              const oldOptions = spaceOptions.splice(0, spaceOptions.length, ...spaceOptions.filter(option => tileMatches(option, criteria)));
              if (oldOptions.length > spaceOptions.length) {
                madeProgress = true;
              }
              console.log('Group Inner Lock In', groupDescription, criteria);
            }
          }
        }
      }
    }
  }
  return madeProgress;
}

function rowSuitSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;
  suit_loop:
  for (const suit of allSuits) {
    const unplacedRemainingTilesOfSuit = tiles.filter(tile => tile.suit === suit).length;
    for (const [rowIndex, row] of board.entries()) {
      const condition = level.rowConditions[rowIndex];
      if (condition.type === 'ContainSuits') {
        const requiredTilesOfSuitInRow = condition.suits.filter(s => s === suit).length;
        const tilesInRowOfSuit = row.filter(tile => tile && tile.suit === suit).length;

        if (requiredTilesOfSuitInRow - tilesInRowOfSuit >= unplacedRemainingTilesOfSuit) {
          for (const [rowOptionsIndex, _] of options.entries()) {
            if (rowOptionsIndex !== rowIndex) {
              for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
                options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.suit !== suit);
                if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                  madeProgress = true;
                  console.log('Row Suit Segregation Elimination', rowOptionsIndex, colOptionsIndex, suit, options[rowOptionsIndex][colOptionsIndex]);
                }
              }
            }
          }
          continue suit_loop;
        }

      }
    }
  }
  return madeProgress;
}

function colSuitSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  const columns = [
    [board[0][0], board[1][0], board[2][0], board[3][0]],
    [board[0][1], board[1][1], board[2][1], board[3][1]],
    [board[0][2], board[1][2], board[2][2], board[3][2]],
    [board[0][3], board[1][3], board[2][3], board[3][3]],
  ];

  suit_loop:
  for (const suit of allSuits) {
    const unplacedRemainingTilesOfSuit = tiles.filter(tile => tile.suit === suit).length;

    for (const [colIndex, col] of columns.entries()) {
      const condition = level.colConditions[colIndex];
      if (condition.type === 'ContainSuits') {
        const requiredTilesOfSuitInCol = condition.suits.filter(s => s === suit).length;
        const tilesInColOfSuit = col.filter(tile => tile && tile.suit === suit).length;

        if (requiredTilesOfSuitInCol - tilesInColOfSuit >= unplacedRemainingTilesOfSuit) {
          for (const [rowOptionsIndex, _] of options.entries()) {
            for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
              if (colOptionsIndex !== colIndex) {
                options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.suit !== suit);
                if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                  madeProgress = true;
                  console.log('Col Suit Segregation Elimination', rowOptionsIndex, colOptionsIndex, suit, options[rowOptionsIndex][colOptionsIndex]);
                }
              }
            }
          }
          continue suit_loop;
        }

      }
    }
  }
  return madeProgress;
}

function rowNumberSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  number_loop:
  for (const number of [1, 2, 3, 4]) {
    const unplacedRemainingTilesOfNumber = tiles.filter(tile => tile.value === number).length;
    for (const [rowIndex, row] of board.entries()) {
      const condition = level.rowConditions[rowIndex];
      if (condition.type === 'ContainNumbers') {
        const requiredTilesOfNumberInRow = condition.numbers.filter(s => s === number).length;
        const tilesInRowOfNumber = row.filter(tile => tile && tile.value === number).length;

        if (requiredTilesOfNumberInRow - tilesInRowOfNumber >= unplacedRemainingTilesOfNumber) {
          for (const [rowOptionsIndex, _] of options.entries()) {
            if (rowOptionsIndex !== rowIndex) {
              for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
                options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.value !== number);
                if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                  madeProgress = true;
                  console.log('Row Number Segregation', rowOptionsIndex, colOptionsIndex, number, options[rowOptionsIndex][colOptionsIndex]);
                }
              }
            }
          }
          continue number_loop;
        }

      }
    }
  }
  return madeProgress;
}

function colNumberSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  const columns = [
    [board[0][0], board[1][0], board[2][0], board[3][0]],
    [board[0][1], board[1][1], board[2][1], board[3][1]],
    [board[0][2], board[1][2], board[2][2], board[3][2]],
    [board[0][3], board[1][3], board[2][3], board[3][3]],
  ];

  number_loop:
  for (const number of [1, 2, 3, 4]) {
    const unplacedRemainingTilesOfNumber = tiles.filter(tile => tile.value === number).length;

    for (const [colIndex, col] of columns.entries()) {
      const condition = level.colConditions[colIndex];
      if (condition.type === 'ContainNumbers') {
        const requiredTilesOfNumberInCol = condition.numbers.filter(s => s === number).length;
        const tilesInColOfNumber = col.filter(tile => tile && tile.value === number).length;

        if (requiredTilesOfNumberInCol - tilesInColOfNumber >= unplacedRemainingTilesOfNumber) {
          for (const [rowOptionsIndex, _] of options.entries()) {
            for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
              if (colOptionsIndex !== colIndex) {
                options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.value !== number);
                if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                  madeProgress = true;
                  console.log('Col Number Segregation Elimination', rowOptionsIndex, colOptionsIndex, number, options[rowOptionsIndex][colOptionsIndex]);
                }
              }
            }
          }
          continue number_loop;
        }

      }
    }
  }
  return madeProgress;
}

function multiRowSuitSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  const rowCombinations = [
    [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
    [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3],
  ];

  suit_loop:
  for (const suit of allSuits) {
    const unplacedRemainingTilesOfSuit = tiles.filter(tile => tile.suit === suit).length;

    for (const rowIndexes of rowCombinations) {
      const conditions = rowIndexes.map(i => level.rowConditions[i]).filter(condition => condition.type === 'ContainSuits');
      const rowCombo = rowIndexes.map(i => board[i]);
      const requiredTilesOfSuitInRows = conditions.map(
        condition => condition.suits.filter(s => s === suit).length
      ).reduce((a, b) => a + b, 0);
      const tilesInRowsOfSuit = rowCombo.map(
        row => row.filter(tile => tile && tile.suit === suit).length
      ).reduce((a, b) => a + b);

      if (requiredTilesOfSuitInRows - tilesInRowsOfSuit >= unplacedRemainingTilesOfSuit) {
        for (const [rowOptionsIndex, _] of options.entries()) {
          for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
            if (!rowIndexes.some(i => i === rowOptionsIndex)) {
              options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.suit !== suit);
              if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                madeProgress = true;
                console.log('Multi Row Suit Segregation Elimination', rowOptionsIndex, colOptionsIndex, suit, options[rowOptionsIndex][colOptionsIndex]);
              }
            }
          }
        }
        continue suit_loop;
      }
    }
  }
  return madeProgress;
}

function multiColSuitSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  const columns = [
    [board[0][0], board[1][0], board[2][0], board[3][0]],
    [board[0][1], board[1][1], board[2][1], board[3][1]],
    [board[0][2], board[1][2], board[2][2], board[3][2]],
    [board[0][3], board[1][3], board[2][3], board[3][3]],
  ];

  const columnCombinations = [
    [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
    [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3],
  ];

  suit_loop:
  for (const suit of allSuits) {
    const unplacedRemainingTilesOfSuit = tiles.filter(tile => tile.suit === suit).length;

    for (const columnIndexes of columnCombinations) {
      const conditions = columnIndexes.map(i => level.colConditions[i]).filter(condition => condition.type === 'ContainSuits');
      const columnCombo = columnIndexes.map(i => columns[i]);
      const requiredTilesOfSuitInCols = conditions.map(
        condition => condition.suits.filter(s => s === suit).length
      ).reduce((a, b) => a + b, 0);
      const tilesInColsOfSuit = columnCombo.map(
        column => column.filter(tile => tile && tile.suit === suit).length
      ).reduce((a, b) => a + b);

      if (requiredTilesOfSuitInCols - tilesInColsOfSuit >= unplacedRemainingTilesOfSuit) {
        for (const [rowOptionsIndex, _] of options.entries()) {
          for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
            if (!columnIndexes.some(i => i === colOptionsIndex)) {
              options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.suit !== suit);
              if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                madeProgress = true;
                console.log('Multi Col Suit Segregation Elimination', rowOptionsIndex, colOptionsIndex, suit, options[rowOptionsIndex][colOptionsIndex]);
              }
            }
          }
        }
        continue suit_loop;
      }
    }
  }
  return madeProgress;
}

function multiRowNumberSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  const rowCombinations = [
    [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
    [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3],
  ];

  number_loop:
  for (const number of [1, 2, 3, 4]) {
    const unplacedRemainingTilesOfNumber = tiles.filter(tile => tile.value === number).length;

    for (const rowIndexes of rowCombinations) {
      const conditions = rowIndexes.map(i => level.rowConditions[i]).filter(condition => condition.type === 'ContainNumbers');
      const rowCombo = rowIndexes.map(i => board[i]);
      const requiredTilesOfNumberInRows = conditions.map(
        condition => condition.numbers.filter(n => n === number).length
      ).reduce((a, b) => a + b, 0);
      const tilesInRowsOfNumber = rowCombo.map(
        row => row.filter(tile => tile && tile.value === number).length
      ).reduce((a, b) => a + b);

      if (requiredTilesOfNumberInRows - tilesInRowsOfNumber >= unplacedRemainingTilesOfNumber) {
        for (const [rowOptionsIndex, _] of options.entries()) {
          for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
            if (!rowIndexes.some(i => i === rowOptionsIndex)) {
              options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.value !== number);
              if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                madeProgress = true;
                console.log('Multi Row Number Segregation Elimination', rowOptionsIndex, colOptionsIndex, number, options[rowOptionsIndex][colOptionsIndex]);
              }
            }
          }
        }
        continue number_loop;
      }
    }
  }
  return madeProgress;
}

function multiColNumberSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  const columns = [
    [board[0][0], board[1][0], board[2][0], board[3][0]],
    [board[0][1], board[1][1], board[2][1], board[3][1]],
    [board[0][2], board[1][2], board[2][2], board[3][2]],
    [board[0][3], board[1][3], board[2][3], board[3][3]],
  ];

  const columnCombinations = [
    [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
    [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3],
  ];

  number_loop:
  for (const number of [1, 2, 3, 4]) {
    const unplacedRemainingTilesOfNumber = tiles.filter(tile => tile.value === number).length;

    for (const columnIndexes of columnCombinations) {
      const conditions = columnIndexes.map(i => level.colConditions[i]).filter(condition => condition.type === 'ContainNumbers');
      const columnCombo = columnIndexes.map(i => columns[i]);
      const requiredTilesOfNumberInCols = conditions.map(
        condition => condition.numbers.filter(n => n === number).length
      ).reduce((a, b) => a + b, 0);
      const tilesInColsOfNumber = columnCombo.map(
        column => column.filter(tile => tile && tile.value === number).length
      ).reduce((a, b) => a + b);

      if (requiredTilesOfNumberInCols - tilesInColsOfNumber >= unplacedRemainingTilesOfNumber) {
        for (const [rowOptionsIndex, _] of options.entries()) {
          for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
            if (!columnIndexes.some(i => i === colOptionsIndex)) {
              options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.value !== number);
              if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                madeProgress = true;
                console.log('Multi Col Number Segregation Elimination', rowOptionsIndex, colOptionsIndex, number, options[rowOptionsIndex][colOptionsIndex]);
              }
            }
          }
        }
        continue number_loop;
      }
    }
  }
  return madeProgress;
}

function multiRowAndColSuitSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  const columnarBoard = [
    [board[0][0], board[1][0], board[2][0], board[3][0]],
    [board[0][1], board[1][1], board[2][1], board[3][1]],
    [board[0][2], board[1][2], board[2][2], board[3][2]],
    [board[0][3], board[1][3], board[2][3], board[3][3]],
  ];

  const combinations = [
    { rows: [0], cols: [0] }, { rows: [0], cols: [1] }, { rows: [0], cols: [2] }, { rows: [0], cols: [3] },
    { rows: [1], cols: [0] }, { rows: [1], cols: [1] }, { rows: [1], cols: [2] }, { rows: [1], cols: [3] },
    { rows: [2], cols: [0] }, { rows: [2], cols: [1] }, { rows: [2], cols: [2] }, { rows: [2], cols: [3] },
    { rows: [3], cols: [0] }, { rows: [3], cols: [1] }, { rows: [3], cols: [2] }, { rows: [3], cols: [3] },
  ];

  suit_loop:
  for (const suit of allSuits) {
    const unplacedRemainingTilesOfSuit = tiles.filter(tile => tile.suit === suit).length;

    for (const indexes of combinations) {
      const rowConditions = indexes.rows.map(i => level.rowConditions[i]).filter(condition => condition.type === 'ContainSuits');
      const colConditions = indexes.cols.map(i => level.colConditions[i]).filter(condition => condition.type === 'ContainSuits');
      const rows = indexes.rows.map(i => board[i]);
      const columns = indexes.cols.map(i => columnarBoard[i]);

      const requiredTilesOfSuitInRows = rowConditions.map(
        condition => condition.suits.filter(s => s === suit).length
      ).reduce((a, b) => a + b, 0);
      const requiredTilesOfSuitInCols = colConditions.map(
        condition => condition.suits.filter(s => s === suit).length
      ).reduce((a, b) => a + b, 0);

      const tilesInRowsOfSuit = rows.map(
        column => column.filter(tile => tile && tile.suit === suit).length
      ).reduce((a, b) => a + b);
      const tilesInColsOfSuit = columns.map(
        column => column.filter(tile => tile && tile.suit === suit).length
      ).reduce((a, b) => a + b);

      let emptyIntersectionsThatCanHaveATileOfSuit = 0;
      for (const row of indexes.rows) {
        for (const col of indexes.cols) {
          if (board[row][col] === undefined && options[row][col].some(tile => tile.suit === suit)) {
            emptyIntersectionsThatCanHaveATileOfSuit += 1;
          }
        }
      }

      const requiredTilesOfSuitInRowsAndCols = requiredTilesOfSuitInCols + requiredTilesOfSuitInRows;
      const tilesOfSuitInRowsOrCols = tilesInColsOfSuit + tilesInRowsOfSuit;
      const unfulfilledRequiredTilesOfSuitInRowAndCols = requiredTilesOfSuitInRowsAndCols - tilesOfSuitInRowsOrCols

      if (unfulfilledRequiredTilesOfSuitInRowAndCols >= unplacedRemainingTilesOfSuit + emptyIntersectionsThatCanHaveATileOfSuit) {
        for (const [rowOptionsIndex, _] of options.entries()) {
          for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
            if (!indexes.cols.some(i => i === colOptionsIndex) && !indexes.rows.some(i => i === rowOptionsIndex)) {
              options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.suit !== suit);
              if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                madeProgress = true;
                console.log('Multi Row And Col Suit Segregation Elimination', rowOptionsIndex, colOptionsIndex, suit, options[rowOptionsIndex][colOptionsIndex]);
              }
            }
          }
        }
        continue suit_loop;
      }
    }
  }
  return madeProgress;
}

function multiRowAndColNumberSegregation(
  level: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  let madeProgress = false;

  const columnarBoard = [
    [board[0][0], board[1][0], board[2][0], board[3][0]],
    [board[0][1], board[1][1], board[2][1], board[3][1]],
    [board[0][2], board[1][2], board[2][2], board[3][2]],
    [board[0][3], board[1][3], board[2][3], board[3][3]],
  ];

  const combinations = [
    { rows: [0], cols: [0] }, { rows: [0], cols: [1] }, { rows: [0], cols: [2] }, { rows: [0], cols: [3] },
    { rows: [1], cols: [0] }, { rows: [1], cols: [1] }, { rows: [1], cols: [2] }, { rows: [1], cols: [3] },
    { rows: [2], cols: [0] }, { rows: [2], cols: [1] }, { rows: [2], cols: [2] }, { rows: [2], cols: [3] },
    { rows: [3], cols: [0] }, { rows: [3], cols: [1] }, { rows: [3], cols: [2] }, { rows: [3], cols: [3] },
  ];

  number_loop:
  for (const number of [1, 2, 3, 4]) {
    const unplacedRemainingTilesOfNumber = tiles.filter(tile => tile.value === number).length;

    for (const indexes of combinations) {
      const rowConditions = indexes.rows.map(i => level.rowConditions[i]).filter(condition => condition.type === 'ContainNumbers');
      const colConditions = indexes.cols.map(i => level.colConditions[i]).filter(condition => condition.type === 'ContainNumbers');
      const rows = indexes.rows.map(i => board[i]);
      const columns = indexes.cols.map(i => columnarBoard[i]);

      const requiredTilesOfNumberInRows = rowConditions.map(
        condition => condition.numbers.filter(n => n === number).length
      ).reduce((a, b) => a + b, 0);
      const requiredTilesOfNumberInCols = colConditions.map(
        condition => condition.numbers.filter(n => n === number).length
      ).reduce((a, b) => a + b, 0);

      const tilesInRowsOfNumber = rows.map(
        column => column.filter(tile => tile && tile.value === number).length
      ).reduce((a, b) => a + b);
      const tilesInColsOfNumber = columns.map(
        column => column.filter(tile => tile && tile.value === number).length
      ).reduce((a, b) => a + b);

      let emptyIntersectionsThatCanHaveATileOfNumber = 0;
      for (const row of indexes.rows) {
        for (const col of indexes.cols) {
          if (board[row][col] === undefined && options[row][col].some(tile => tile.value === number)) {
            emptyIntersectionsThatCanHaveATileOfNumber += 1;
          }
        }
      }

      const requiredTilesOfNumberInRowsAndCols = requiredTilesOfNumberInCols + requiredTilesOfNumberInRows;
      const tilesOfNumberInRowsOrCols = tilesInColsOfNumber + tilesInRowsOfNumber;
      const unfulfilledRequiredTilesOfNumberInRowAndCols = requiredTilesOfNumberInRowsAndCols - tilesOfNumberInRowsOrCols

      if (unfulfilledRequiredTilesOfNumberInRowAndCols >= unplacedRemainingTilesOfNumber + emptyIntersectionsThatCanHaveATileOfNumber) {
        for (const [rowOptionsIndex, _] of options.entries()) {
          for (const [colOptionsIndex, spaceOptions] of options[rowOptionsIndex].entries()) {
            if (!indexes.cols.some(i => i === colOptionsIndex) && !indexes.rows.some(i => i === rowOptionsIndex)) {
              options[rowOptionsIndex][colOptionsIndex] = spaceOptions.filter(tile => tile.value !== number);
              if (options[rowOptionsIndex][colOptionsIndex].length !== spaceOptions.length) {
                madeProgress = true;
                console.log('Multi Row And Col Number Segregation Elimination', rowOptionsIndex, colOptionsIndex, number, options[rowOptionsIndex][colOptionsIndex]);
              }
            }
          }
        }
        continue number_loop;
      }
    }
  }
  return madeProgress;
}

function hiddenSingle(
  _: Level,
  board: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  tiles: Array<Tile>,
): boolean {
  for (const tile of tiles) {
    const availableSpaces = [];
    for (const [rowIndex, rowOptions] of options.entries()) {
      for (const [colIndex, spaceOptions] of rowOptions.entries()) {
        if (spaceOptions.some(option => tilesAreEqual(tile, option))) {
          availableSpaces.push({row: rowIndex, col: colIndex});
        }
      }
    }
    if (availableSpaces.length === 1) {
      const {row, col} = availableSpaces[0];
      placeTile(board, options, tiles, tile, row, col)
      console.log(row, col, 'hiddenSingle');
      return true;
    }
  }
  return false;
}

const allSpaces = [0, 1, 2, 3].flatMap(row => [0, 1, 2, 3].map((col) => {return {row, col}}));
const allPairsOfSpaces = allSpaces.flatMap(
  (first, i) => allSpaces.slice(i + 1).map(second => [first, second])
);

const allTiles = [1, 2, 3, 4].flatMap(
  (number) => allSuits.map(suit => { return {value: number, suit} }),
);

function nakedPair(
  _: Level,
  __: Array<Array<Tile | undefined>>,
  options: Array<Array<Array<Tile>>>,
  ___: Array<Tile>,
): boolean {
  let madeProgress = false;

  for (const [firstSpace, secondSpace] of allPairsOfSpaces) {
    if (options[firstSpace.row][firstSpace.col].length === 2
      && options[secondSpace.row][secondSpace.col].length === 2)
    {
      const firstSpaceFirstOption = options[firstSpace.row][firstSpace.col][0];
      const firstSpaceSecondOption = options[firstSpace.row][firstSpace.col][1];
      const secondSpaceFirstOption = options[secondSpace.row][secondSpace.col][0];
      const secondSpaceSecondOption = options[secondSpace.row][secondSpace.col][1];

      if (
        (tilesAreEqual(firstSpaceFirstOption, secondSpaceFirstOption)
          && tilesAreEqual(firstSpaceSecondOption, secondSpaceSecondOption))
        || (tilesAreEqual(firstSpaceFirstOption, secondSpaceSecondOption)
          && tilesAreEqual(firstSpaceSecondOption, secondSpaceFirstOption))
      ) {
        const firstOption = options[firstSpace.row][firstSpace.col][0];
        const secondOption = options[firstSpace.row][firstSpace.col][1];

        for (const [rowIndex, rowOptions] of options.entries()) {
          for (const [colIndex, spaceOptions] of rowOptions.entries()) {
            if (
              !((rowIndex === firstSpace.row && colIndex === firstSpace.col)
                || (rowIndex === secondSpace.row && colIndex === secondSpace.col)
              )
            ) {
              options[rowIndex][colIndex] = spaceOptions.filter(tile => !tilesAreEqual(tile, firstOption) && !tilesAreEqual(tile, secondOption));
              if (options[rowIndex][colIndex].length !== spaceOptions.length) {
                madeProgress = true;
                console.log('Naked Pair', rowIndex, colIndex, firstOption, secondOption, spaceOptions);
              }
            }
          }
        }
      }
    }
  }
  return madeProgress;
}

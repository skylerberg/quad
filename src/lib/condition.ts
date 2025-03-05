import type { Level } from './level.ts';
import type { Tile, TileValue } from './tile.ts';
import type { Suit } from './suit.ts';

export type Condition = (
    { type: 'Contain', suits: Array<Suit>, numbers: Array<TileValue>} |
    { type: 'SumGreaterThan', amount: number } |
    { type: 'OddOrSuit', suit: Suit } |
    { type: 'EvenOrSuit', suit: Suit }
  ) & { title: string | undefined }

export function evaluate(
  condition: Condition,
  spaces: Array<Tile | null>
): boolean | null {
  const tiles: Array<Tile> = spaces.filter(space => !!space);
  const complete = tiles.length === 4;

  if (condition.type === 'SumGreaterThan') {
    const total = tiles.reduce(
      (accumulator, tile) => accumulator + tile.value,
      0,
    );
    if (total > condition.amount) {
      return true;
    }
    else if (complete) {
      return false;
    }
    else if (total + 4 * (4 - tiles.length) <= condition.amount) {
      return false;
    }
    else {
      return null;
    }
  }

  if (condition.type === 'Contain') {
    let unmatchedSuits = countUnmatchedSuits(tiles, condition.suits);
    let unmatchedNumbers = countUnmatchedNumbers(tiles, condition.numbers);
    let openSpaces = 4 - tiles.length;
    if (unmatchedSuits === 0 && unmatchedNumbers === 0) {
      return true;
    }
    if (unmatchedSuits > openSpaces || unmatchedNumbers > openSpaces) {
      return false;
    }
    return null;
  }

  if (condition.type === 'EvenOrSuit') {
    for (const tile of tiles) {
      if (!(tile.suit === condition.suit || tile.value % 2 === 0)) {
        return false;
      }
    }
    return complete || null;
  }

  if (condition.type === 'OddOrSuit') {
    for (const tile of tiles) {
      if (!(tile.suit === condition.suit || tile.value % 2 === 1)) {
        return false;
      }
    }
    return complete || null;
  }

  throw new Error(`Programming Error: Condition "${condition.type}" did not match any evaluator`);
}

export function countUnmatchedSuits(
  tiles: Array<Tile>,
  requiredSuits: Array<Suit>,
): number {
  const unmatchedSuits = requiredSuits.slice();

  for (const tile of tiles) {
    var index = unmatchedSuits.indexOf(tile.suit);
    if (index !== -1) {
      unmatchedSuits.splice(index, 1);
    }
  }
  return unmatchedSuits.length
}

export function countUnmatchedNumbers(
  tiles: Array<Tile>,
  requiredNumbers: Array<TileValue>,
): number {
  const unmatchedNumbers = requiredNumbers.slice();

  for (const tile of tiles) {
    var index = unmatchedNumbers.indexOf(tile.value);
    if (index !== -1) {
      unmatchedNumbers.splice(index, 1);
    }
  }

  return unmatchedNumbers.length;
}

export function getTitle(level: Level, condition: Condition, type: 'row' | 'column'): string {
  let symbolName = 'flowers';
  if (level.section === 'Celestial') {
    symbolName = 'celestial objects';
  }
  else if (level.section === 'Elemental') {
    symbolName = 'elements';
  }

  if (condition.type === 'SumGreaterThan') {
    return `Tiles in ${type} must add to more than ${condition.amount}`;
  }

  if (condition.type === 'Contain') {
    if (condition.suits.length === 0) {
      return `This ${type} must have these numbers`;
    }
    if (condition.numbers.length === 0) {
      return `This ${type} must have these ${symbolName}`;
    }
    return `This ${type} must have these ${symbolName} and numbers`;
  }

  if (condition.type === 'EvenOrSuit') {
    return `Each tile in ${type} must be even or match the symbol shown`;
  }

  if (condition.type === 'OddOrSuit') {
    return `Each tile in ${type} must be odd or match the symbol shown`;
  }

  throw new Error(`Programming Error: Condition "${condition.type}" needs a title`);
}

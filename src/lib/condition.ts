import type { Tile, TileValue } from './tile.ts';
import type { Suit } from './suit.ts';
import { blue, green, white, red } from './suit';

export type Condition = (
    { type: 'EachSuit', } |
    { type: 'EachNumber', } |
    { type: 'AllOfSuit', suit: Suit } |
    { type: 'AllOfNumber', value: TileValue } |
    { type: 'MixOfSuits', suits: Array<Suit> } |
    { type: 'SumGreaterThan', amount: number } |
    { type: 'OddOrSuit', suit: Suit } |
    { type: 'EvenOrSuit', suit: Suit }
  ) & { title: string | undefined }



export function evaluate(
  condition: Condition,
  spaces: Array<Tile | undefined>
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

  if (condition.type === 'AllOfSuit') {
    return containsSuits(
      tiles,
      [condition.suit, condition.suit, condition.suit, condition.suit],
    );
  }

  if (condition.type === 'EachSuit') {
    return containsSuits(tiles, [red, blue, white, green]);
  }

  if (condition.type === 'MixOfSuits') {
    return containsSuits(tiles, condition.suits);
  }

  if (condition.type === 'AllOfNumber') {
    return containsNumbers(
      tiles,
      [ condition.value, condition.value, condition.value, condition.value],
    );
  }

  if (condition.type === 'EachNumber') {
    return containsNumbers(tiles, [1, 2, 3, 4]);
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

export function containsSuits(
  tiles: Array<Tile>,
  requiredSuits: Array<Suit>,
): boolean | null {
  const suits = requiredSuits.slice();
  const complete = tiles.length === 4;

  for (const tile of tiles) {
    var index = suits.indexOf(tile.suit);
    if (index === -1) {
      return false;
    }
    suits.splice(index, 1);
  }
  if (!complete) {
    return null;
  }
  return suits.length === 0;
}

export function containsNumbers(
  tiles: Array<Tile>,
  requiredNumbers: Array<TileValue>,
): boolean | null {
  const numbers = requiredNumbers.slice();
  const complete = tiles.length === 4;

  for (const tile of tiles) {
    var index = numbers.indexOf(tile.value);
    if (index === -1) {
      return false;
    }
    numbers.splice(index, 1);
  }
  if (!complete) {
    return null;
  }
  return numbers.length === 0;
}

export function getTitle(condition: Condition, type: 'row' | 'column'): string {
  if (condition.type === 'SumGreaterThan') {
    return `Tiles in ${type} must add to more than ${condition.amount}`;
  }

  if (condition.type === 'AllOfSuit') {
    return `Each tile in ${type} must match the symbol shown`;
  }

  if (condition.type === 'EachSuit') {
    return `Must have one tile of each symbol in ${type}`;
  }

  if (condition.type === 'MixOfSuits') {
    return `Must have a matching tile in ${type} for each shown symbol`;
  }

  if (condition.type === 'AllOfNumber') {
    return `Each tile in ${type} must be a ${condition.value}`;
  }

  if (condition.type === 'EachNumber') {
    return `Must have one tile of each number in ${type}`;
  }

  if (condition.type === 'EvenOrSuit') {
    return `Each tile in ${type} must be even or match the symbol shown`;
  }

  if (condition.type === 'OddOrSuit') {
    return `Each tile in ${type} must be odd or match the symbol shown`;
  }

  throw new Error(`Programming Error: Condition "${condition.type}" did not match any evaluator`);
}

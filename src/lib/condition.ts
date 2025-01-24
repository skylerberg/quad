import type { Tile } from './tile.ts';
import type { Suit } from './suit.ts';
import { blue, green, white, red } from './suit';

export type Condition = { type: 'SumGreaterThan', amount: number } |
    { type: 'EachSuit', } |
    { type: 'EachNumber', } |
    { type: 'OddOrSuit', suit: Suit } |
    { type: 'EvenOrSuit', suit: Suit }


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

  if (condition.type === 'EachSuit') {
    const requiredSuits = [red, blue, white, green];
    for (const tile of tiles) {
      var index = requiredSuits.indexOf(tile.suit);
      if (index === -1) {
        return false;
      }
      requiredSuits.splice(index, 1);
    }
    if (!complete) {
      return null;
    }
    return requiredSuits.length === 0;
  }

  if (condition.type === 'EachNumber') {
    const requiredNumbers = [1, 2, 3, 4];
    for (const tile of tiles) {
      var index = requiredNumbers.indexOf(tile.value);
      if (index === -1) {
        return false;
      }
      requiredNumbers.splice(index, 1);
    }
    if (!complete) {
      return null;
    }
    return requiredNumbers.length === 0;
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

export function getTitle(condition: Condition, type: 'row' | 'col'): string {
  if (condition.type === 'SumGreaterThan') {
    return `Tiles in ${type} must add to more than ${condition.amount}`;
  }

  if (condition.type === 'EachSuit') {
    return `Must have one tile of each symbol in ${type}`;
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

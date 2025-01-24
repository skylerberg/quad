import type { Suit } from './suit.ts';
import { blue, green, white, red } from './suit';

export type Condition = { type: 'SumGreaterThan', amount: number } |
    { type: 'EachSuit', } |
    { type: 'EachNumber', } |
    { type: 'OddOrSuit', suit: Suit } |
    { type: 'EvenOrSuit', suit: Suit }


export function evaluate(
  condition: Condition,
  tiles: Array<{value: number, suit: Suit} | undefined>
): boolean | null {
  if (condition.type === 'SumGreaterThan') {
    const total = tiles.reduce(
      (accumulator, tile) => tile ? accumulator + tile.value : accumulator,
      0,
    );
    if (total > condition.amount) {
      return true;
    }
    else if (tiles.every((tile) => !!tile)) {
      return false;
    }
    else {
      return null;
    }
  }

  if (condition.type === 'EachSuit') {
    const requiredSuits = [red, blue, white, green];
    for (const tile of tiles) {
      if (!tile) {
        return null;
      }
      var index = requiredSuits.indexOf(tile.suit);
      if (index === -1) {
        return false;
      }
      requiredSuits.splice(index, 1);
    }
    return requiredSuits.length === 0;
  }

  if (condition.type === 'EachNumber') {
    const requiredNumbers = [1, 2, 3, 4];
    for (const tile of tiles) {
      if (!tile) {
        return null;
      }
      var index = requiredNumbers.indexOf(tile.value);
      if (index === -1) {
        return false;
      }
      requiredNumbers.splice(index, 1);
    }
    return requiredNumbers.length === 0;
  }

  if (condition.type === 'EvenOrSuit') {
    for (const tile of tiles) {
      if (!tile) {
        return null;
      }
      if (!(tile.suit === condition.suit || tile.value % 2 === 0)) {
        return false;
      }
    }
    return true;
  }

  if (condition.type === 'OddOrSuit') {
    for (const tile of tiles) {
      if (!tile) {
        return null;
      }
      if (!(tile.suit === condition.suit || tile.value % 2 === 1)) {
        return false;
      }
    }
    return true;
  }

  throw new Error(`Programming Error: Condition "${condition.type}" did not match any evaluator`);
}

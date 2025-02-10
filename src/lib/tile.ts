import type { Suit } from './suit.ts';


export type TileValue = 1 | 2 | 3 | 4
export type Tile = { value: TileValue, suit: Suit };

export function tilesAreEqual(a: Tile | undefined, b: Tile | undefined) {
  if (a === undefined || b === undefined) {
    return false;
  }
  return a.value === b.value && a.suit === b.suit;
}

export const allNumbers: Array<TileValue> = [1, 2, 3, 4];

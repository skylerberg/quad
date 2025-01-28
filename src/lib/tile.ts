import type { Suit } from './suit.ts';


export type TileValue = 1 | 2 | 3 | 4
export type Tile = { value: TileValue, suit: Suit };

export function tilesAreEqual(a: Tile, b: Tile) {
  return a.value === b.value && a.suit === b.suit;
}

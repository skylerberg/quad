import tulip from '../assets/tulip.svg';
import daisy from '../assets/daisy.svg';
import lotus from '../assets/lotus.svg';
import rose from '../assets/rose.svg';

export type Suit = 'R' | 'B' | 'W' | 'G';
export type Rank = 1 | 2 | 3 | 4;
export type Tile = { rank: Rank, suit: Suit };

export const red: Suit = 'R';
export const blue: Suit = 'B';
export const white: Suit = 'W';
export const green: Suit = 'G';

export const allSuits = [blue, green, red, white];

export function suitSymbolToName(suit: Suit): string {
  if (suit === red) {
    return 'red';
  }
  else if (suit === blue) {
    return 'blue';
  }
  else if (suit === white) {
    return 'white';
  }
  return 'green';
}

export function getSuitIcon(suit: Suit): string {
  if (suit === red) {
    return rose;
  }
  else if (suit === blue) {
    return lotus;
  }
  else if (suit === white) {
    return daisy;
  }
  return tulip;
}

export function tilesAreEqual(a: Tile | undefined, b: Tile | undefined) {
  if (a === undefined || b === undefined) {
    return false;
  }
  return a.rank === b.rank && a.suit === b.suit;
}

export const allRanks: Array<Rank> = [1, 2, 3, 4];

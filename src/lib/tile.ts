import lotus from '../assets/lotus.svg';
import tulip from '../assets/tulip.svg';
import rose from '../assets/rose.svg';
import daisy from '../assets/daisy.svg';
import water from '../assets/water.svg?no-inline';
import earth from '../assets/earth.svg?no-inline';
import fire from '../assets/fire.svg?no-inline';
import air from '../assets/air.svg?no-inline';
import type { Difficulty } from './puzzle.svelte';

export type Suit = 'R' | 'B' | 'W' | 'G';
export type Rank = 1 | 2 | 3 | 4;
export type Tile = { rank: Rank, suit: Suit, locked: boolean };

export const red: Suit = 'R';
export const blue: Suit = 'B';
export const white: Suit = 'W';
export const green: Suit = 'G';

export const allSuits = [blue, green, red, white];

export function suitSymbolToName(suit: Suit, difficulty: Difficulty): string {
  if (suit === red) {
    if (difficulty === 'Challenge') {
      return 'fire';
    }
    return 'rose';
  }
  else if (suit === blue) {
    if (difficulty === 'Challenge') {
      return 'water';
    }
    return 'lotus';
  }
  else if (suit === white) {
    if (difficulty === 'Challenge') {
      return 'air';
    }
    return 'daisy';
  }
  if (difficulty === 'Challenge') {
    return 'earth';
  }
  return 'tulip';
}

const releaseElements = false;

export function getSuitIcon(suit: Suit, difficulty: Difficulty): string {
  if (suit === red) {
    if (releaseElements && difficulty === 'Challenge') {
      return fire;
    }
    return rose;
  }
  else if (suit === blue) {
    if (releaseElements && difficulty === 'Challenge') {
      return water;
    }
    return lotus;
  }
  else if (suit === white) {
    if (releaseElements && difficulty === 'Challenge') {
      return air;
    }
    return daisy;
  }
  else {
    if (releaseElements && difficulty === 'Challenge') {
      return earth;
    }
    return tulip;
  }
}

export function getTileName(tile: Tile, difficulty: Difficulty): string {
  return `${suitSymbolToName(tile.suit, difficulty)} ${tile.rank}${tile.locked ? ' immovable' : ''}`;
}

export function tilesAreEqual(a: Tile | undefined | null, b: Tile | undefined | null) {
  if (a === undefined || b === undefined || a === null || b === null) {
    return false;
  }
  return a.rank === b.rank && a.suit === b.suit;
}

export const allRanks: Array<Rank> = [1, 2, 3, 4];

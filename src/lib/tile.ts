import lotus from '../assets/lotus.svg?no-inline';
import tulip from '../assets/tulip.svg?no-inline';
import rose from '../assets/rose.svg?no-inline';
import daisy from '../assets/daisy.svg?no-inline';
import water from '../assets/water.svg?no-inline';
import leaf from '../assets/leaf.svg?no-inline';
import fire from '../assets/fire.svg?no-inline';
import air from '../assets/air.svg?no-inline';
import star from '../assets/star.svg?no-inline';
import earth from '../assets/earth.svg?no-inline';
import sun from '../assets/sun.svg?no-inline';
import moon from '../assets/moon.svg?no-inline';
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
    if (difficulty === 'Expert') {
      return 'sun';
    }
    if (difficulty === 'Challenge') {
      return 'fire';
    }
    return 'rose';
  }
  else if (suit === blue) {
    if (difficulty === 'Expert') {
      return 'star';
    }
    if (difficulty === 'Challenge') {
      return 'water';
    }
    return 'lotus';
  }
  else if (suit === white) {
    if (difficulty === 'Expert') {
      return 'moon';
    }
    if (difficulty === 'Challenge') {
      return 'air';
    }
    return 'daisy';
  }
  if (difficulty === 'Expert') {
    return 'earth';
  }
  if (difficulty === 'Challenge') {
    return 'leaf';
  }
  return 'tulip';
}

const releaseElements = true;

export function getSuitIcon(suit: Suit, difficulty: Difficulty): string {
  if (suit === red) {
    if (difficulty === 'Expert') {
      return sun;
    }
    if (releaseElements && difficulty === 'Challenge') {
      return fire;
    }
    return rose;
  }
  else if (suit === blue) {
    if (difficulty === 'Expert') {
      return star;
    }
    if (releaseElements && difficulty === 'Challenge') {
      return water;
    }
    return lotus;
  }
  else if (suit === white) {
    if (difficulty === 'Expert') {
      return moon;
    }
    if (releaseElements && difficulty === 'Challenge') {
      return air;
    }
    return daisy;
  }
  else {
    if (difficulty === 'Expert') {
      return earth;
    }
    if (releaseElements && difficulty === 'Challenge') {
      return leaf;
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

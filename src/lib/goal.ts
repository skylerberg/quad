import type { Level } from './level.ts';
import type { Tile, Rank, Suit } from './tile.ts';

export type Goal = {
  suits: Array<Suit>,
  ranks: Array<Rank>,
}

export function evaluate(
  goal: Goal,
  spaces: Array<Tile | null>,
): boolean | null {
  const tiles: Array<Tile> = spaces.filter(space => !!space);

  let unmatchedSuits = countUnmatchedSuits(tiles, goal.suits);
  let unmatchedRanks = countUnmatchedRanks(tiles, goal.ranks);
  let openSpaces = 4 - tiles.length;
  if (unmatchedSuits === 0 && unmatchedRanks === 0) {
    return true;
  }
  if (unmatchedSuits > openSpaces || unmatchedRanks > openSpaces) {
    return false;
  }
  return null;
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

export function countUnmatchedRanks(
  tiles: Array<Tile>,
  requiredRanks: Array<Rank>,
): number {
  const unmatchedRanks = requiredRanks.slice();

  for (const tile of tiles) {
    var index = unmatchedRanks.indexOf(tile.rank);
    if (index !== -1) {
      unmatchedRanks.splice(index, 1);
    }
  }

  return unmatchedRanks.length;
}

export function getTitle(level: Level, goal: Goal, type: 'row' | 'column'): string {
  let symbolName = 'flower';
  let symbolNamePlural = 'flowers';
  if (level.section === 'Celestial') {
    symbolName = 'celestial object';
    symbolNamePlural = 'celestial objects';
  }
  else if (level.section === 'Elemental') {
    symbolName = 'element';
    symbolNamePlural = 'elements';
  }

  if (goal.suits.length === 0) {
    return `This ${type} must have these numbers`;
  }
  if (goal.ranks.length === 0) {
    return `This ${type} must have these ${symbolNamePlural}`;
  }
  return `This ${type} must have these ${symbolNamePlural} and numbers`;
}

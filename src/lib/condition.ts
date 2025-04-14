import type { Level } from './level.ts';
import type { Tile, TileValue } from './tile.ts';
import type { Suit } from './suit.ts';

const directionCoordinates: Record<Direction, [number, number]> = {
  above: [-1, 0],
  below: [1, 0],
  right: [0, 1],
  left: [0, -1],
  aboveRight: [-1, 1],
  aboveLeft: [-1, -1],
  belowRight: [1, 1],
  belowLeft: [1, -1],
}

type Direction = 'above' | 'below' | 'right' | 'left' | 'aboveLeft' | 'aboveRight' | 'belowLeft' | 'belowRight';
type Similarity = 'similar' | 'dissimilar';

export type Condition = (
    { type: 'Contain', suits: Array<Suit>, numbers: Array<TileValue>} |
    { type: 'Similarities', similarities: Record<Direction, Similarity>} |
    { type: 'SumGreaterThan', amount: number } |
    { type: 'OddOrSuit', suit: Suit } |
    { type: 'EvenOrSuit', suit: Suit }
  ) & { title: string | undefined }


function tilesAreSimilar(left: Tile, right: Tile): boolean {
  return left.suit === right.suit || left.value == right.value;
}

export function evaluate(
  condition: Condition,
  spaces: Array<Tile | null>,
  type: 'row' | 'column' | undefined,
  position: number | undefined,
  board: Array<Array<Tile | null>> | undefined,
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

  if (condition.type === 'Similarities') {
    if (!type || position === undefined || !board) {
      throw Error('type, position, and board must all be provided to evaluate similarity conditions');
    }
    for (let [i, tile] of spaces.entries()) {
      for (let [direction, [rowOffset, colOffset]] of Object.entries(directionCoordinates) as Array<[Direction, [number, number]]>) {
        if (!condition.similarities[direction]) {
          continue;
        }
        const row = type === 'row' ? position : i;
        const col = type === 'column' ? position : i;
        const otherTile = board[row + rowOffset][col + colOffset];
        if (!tile || !otherTile) {
          return null;
        }

        if (condition.similarities[direction] === 'similar') {
          if (!tilesAreSimilar(tile, otherTile)) {
            return false;
          }
        }

        if (condition.similarities[direction] === 'dissimilar') {
          if (tilesAreSimilar(tile, otherTile)) {
            return false;
          }
        }
      }
    }
    return true;
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

  if (condition.type === 'SumGreaterThan') {
    return `Tiles in ${type} must add to more than ${condition.amount}`;
  }

  if (condition.type === 'Contain') {
    if (condition.suits.length === 0) {
      return `This ${type} must have these numbers`;
    }
    if (condition.numbers.length === 0) {
      return `This ${type} must have these ${symbolNamePlural}`;
    }
    return `This ${type} must have these ${symbolNamePlural} and numbers`;
  }

  if (condition.type === 'Similarities') {
    if (Object.keys(condition.similarities).length === 1) {
      if (condition.similarities.above && condition.similarities.above === 'similar') {
        return `Each tile in this ${type} must have the same number or ${symbolName} as the tile above it`;
      }
      else if (condition.similarities.above && condition.similarities.above === 'dissimilar') {
        return `Each tile in this ${type} must not have the same number or ${symbolName} as the tile above it`;
      }

      else if (condition.similarities.below && condition.similarities.below === 'similar') {
        return `Each tile in this ${type} must have the same number or ${symbolName} as the tile below it`;
      }
      else if (condition.similarities.below && condition.similarities.below === 'dissimilar') {
        return `Each tile in this ${type} must not have the same number or ${symbolName} as the tile below it`;
      }

      else if (condition.similarities.left && condition.similarities.left === 'similar') {
        return `Each tile in this ${type} must have the same number or ${symbolName} as the tile to the left it`;
      }
      else if (condition.similarities.left && condition.similarities.left === 'dissimilar') {
        return `Each tile in this ${type} must not have the same number or ${symbolName} as the tile to the left of it`;
      }

      else if (condition.similarities.right && condition.similarities.right === 'similar') {
        return `Each tile in this ${type} must have the same number or ${symbolName} as the tile to the right it`;
      }
      else if (condition.similarities.right && condition.similarities.right === 'dissimilar') {
        return `Each tile in this ${type} must not have the same number or ${symbolName} as the tile to the right of it`;
      }
    }
    else if (Object.keys(condition.similarities).length === 2) {
      if (condition.similarities.above && condition.similarities.below) {
        let aboveCondition = condition.similarities.above ? 'have' : 'not have';
        let belowCondition = condition.similarities.below ? 'have' : 'not have';
        let explainationClause = `the same number or ${symbolName} as the tile`;
        return `Each tile in this ${type} must ${aboveCondition} ${explainationClause} above it and ${belowCondition} ${explainationClause} below it`;
      }
      if (condition.similarities.left && condition.similarities.right) {
        let leftCondition = condition.similarities.left ? 'have' : 'not have';
        let rightCondition = condition.similarities.right ? 'have' : 'not have';
        let explainationClause = `the same number or ${symbolName} as the tile`;
        return `Each tile in this ${type} must ${leftCondition} ${explainationClause} to the left of it and ${rightCondition} ${explainationClause} to the right of it`;
      }
    }
    console.log(condition);
  }

  if (condition.type === 'EvenOrSuit') {
    return `Each tile in ${type} must be even or match the symbol shown`;
  }

  if (condition.type === 'OddOrSuit') {
    return `Each tile in ${type} must be odd or match the symbol shown`;
  }

  throw new Error(`Programming Error: Condition "${condition.type}" needs a title`);
}

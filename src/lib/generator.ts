import type{ TileValue } from './tile.ts';
import type { Suit } from './suit.ts';
import type { Level } from './level.ts';
import type { Condition } from './condition.ts';
import { allSuits } from './suit';
import { allNumbers } from './tile';
import { checkPuzzle, solve, tacticalSolver } from './solver';

export function randomLevel(): Level {
  let level: Level = {
    id: 'asdf',
    rowConditions: [],
    colConditions: [],
  };
  do {
    level.rowConditions = [];
    for (let row = 0; row < 4; row++) {
      level.rowConditions.push(randomCondition());
    }
    level.colConditions = [];
    for (let col = 0; col < 4; col++) {
      level.colConditions.push(randomCondition());
    }
  } while (!solve(level));

  return level;
}


function randomCondition(): Condition {
  if (Math.floor(Math.random() * 2) === 0) {
    return {
      type: 'Contain',
      suits: [randomElement(allSuits), randomElement(allSuits), randomElement(allSuits), randomElement(allSuits)] as Suit[],
      numbers: [] as TileValue[],
    }
  }
  else {
    return {
      type: 'Contain',
      suits: [] as Array<Suit>,
      numbers: [randomElement(allNumbers), randomElement(allNumbers), randomElement(allNumbers), randomElement(allNumbers)] as Array<TileValue>,
    }
  }
}

function randomElement<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

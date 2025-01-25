import type { Condition } from './condition';
import { red, blue, green, white } from './suit';

export type level = {
  rowConditions: Array<Condition>,
  colConditions: Array<Condition>,
};

export const levels = [
  {
    rowConditions: [
      {type: 'AllOfNumber', value: 4},
      {type: 'EachSuit'},
      {type: 'EachSuit'},
      {type: 'EachSuit'},
    ],
    colConditions: [
      {type: 'AllOfSuit', suit: green},
      {type: 'EachNumber'},
      {type: 'EachNumber' },
      {type: 'EachNumber' },
    ]
  },
  {
    rowConditions: [
      {type: 'AllOfSuit', suit: white},
      {type: 'MixOfSuits', suits: [red, red, green, green ]},
      {type: 'MixOfSuits', suits: [blue, blue, red, green ]},
      {type: 'EachNumber'},
    ],
    colConditions: [
      {type: 'EachNumber'},
      {type: 'MixOfSuits', suits: [white, red, green, green ]},
      {type: 'MixOfSuits', suits: [white, red, green, green ]},
      {type: 'EachNumber' },
    ]
  },
  {
    rowConditions: [
      {type: 'SumGreaterThan', amount: 11},
      {type: 'OddOrSuit', suit: blue},
      {type: 'EachSuit' },
      {type: 'EachNumber' },
    ],
    colConditions: [
      {type: 'SumGreaterThan', amount: 11},
      {type: 'EvenOrSuit', suit: red},
      {type: 'EachSuit' },
      {type: 'EachNumber' },
    ]
  },
];


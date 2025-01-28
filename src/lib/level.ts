import type { Condition } from './condition';
import { red, blue, green, white } from './suit';

export type Level = {
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
  {
    rowConditions: [
      {type: 'MixOfNumbers', numbers: [1, 4, 4, 4 ]},
      {type: 'MixOfNumbers', numbers: [1, 1, 2, 3 ]},
      {type: 'MixOfSuits', suits: [white, white, white, blue ]},
      {type: 'MixOfSuits', suits: [red, red, green, blue ]},
    ],
    colConditions: [
      {type: 'MixOfNumbers', numbers: [1, 1, 1, 4 ]},
      {type: 'MixOfNumbers', numbers: [2, 2, 3, 4 ]},
      {type: 'MixOfSuits', suits: [blue, blue, blue, white ]},
      {type: 'MixOfSuits', suits: [green, green, green, blue ]},
    ]
  },
  {
    rowConditions: [
      {type: 'MixOfSuits', suits: [red, red, green, green ]},
      {type: 'MixOfSuits', suits: [red, red, green, green ]},
      {type: 'MixOfSuits', suits: [white, white, blue, blue ]},
      {type: 'MixOfSuits', suits: [white, white, blue, blue ]},
    ],
    colConditions: [
      {type: 'MixOfSuits', suits: [red, red, white, white ]},
      {type: 'MixOfSuits', suits: [red, red, white, white ]},
      {type: 'MixOfSuits', suits: [green, green, blue, blue ]},
      {type: 'MixOfSuits', suits: [green, green, blue, blue ]},
    ]
  },
];


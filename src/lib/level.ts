import type { Condition } from './condition';
import { red, blue, green, white } from './suit';

export type Level = {
  rowConditions: Array<Condition>,
  colConditions: Array<Condition>,
};

export const levels = [
  {
    rowConditions: [
      {type: 'Contain', suits: [blue, blue], numbers: [1, 1]},
      {type: 'Contain', suits: [blue, blue, white], numbers: [1]},
      {type: 'Contain', suits: [green, white, green, white], numbers: []},
      {type: 'Contain', suits: [red, red, red, red], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [green, green, green, red], numbers: []},
      {type: 'Contain', numbers: [3, 4], suits: [blue, blue]},
      {type: 'Contain', numbers: [1, 1], suits: [blue, blue]},
      {type: 'Contain', numbers: [], suits: [white, white, white, red]},
    ]
  },

  {  // Single Group Outer Lockout; Multi Group Outer Lockout; Single Group Inner Lockout
    rowConditions: [
      {type: 'Contain', numbers: [4, 4, 4, 3], suits: []},
      {type: 'Contain', suits: [blue, white, green, white], numbers: []},
      {type: 'Contain', suits: [blue, white, green, blue], numbers: []},
      {type: 'Contain', suits: [red, red, red, red], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [green, green, green, red], numbers: []},
      {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
      {type: 'Contain', numbers: [1, 2, 3, 3], suits: []},
      {type: 'Contain', numbers: [1, 2, 4, 4], suits: []},
    ]
  },

  { // Condition Based Elimination
    rowConditions: [
      {type: 'Contain', suits: [red, red, green, green ], numbers: []},
      {type: 'Contain', suits: [red, red, green, green ], numbers: []},
      {type: 'Contain', suits: [white, white, blue, blue ], numbers: []},
      {type: 'Contain', suits: [white, white, blue, blue ], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [red, red, white, white ], numbers: []},
      {type: 'Contain', suits: [red, red, white, white ], numbers: []},
      {type: 'Contain', suits: [green, green, blue, blue ], numbers: []},
      {type: 'Contain', suits: [green, green, blue, blue ], numbers: []},
    ]
  },

  { // Condition Based Elimination
    rowConditions: [
      {type: 'Contain', suits: [red, red, red, green ], numbers: []},
      {type: 'Contain', suits: [red, green, green, green ], numbers: []},
      {type: 'Contain', suits: [blue, blue, blue, white ], numbers: []},
      {type: 'Contain', suits: [white, white, white, blue ], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [blue, blue, green, green ], numbers: []},
      {type: 'Contain', suits: [blue, red, green, white ], numbers: []},
      {type: 'Contain', suits: [red, green, white, white ], numbers: []},
      {type: 'Contain', suits: [red, red, blue, white ], numbers: []},
    ]
  },

  {
    rowConditions: [
      {type: 'Contain', numbers: [4, 4, 4, 4], suits: []},
      {type: 'Contain', suits: [blue, white, green, red], numbers: []},
      {type: 'Contain', suits: [blue, white, green, red], numbers: []},
      {type: 'Contain', suits: [blue, white, green, red], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [green, green, green, green], numbers: []},
      {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
      {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
      {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
    ]
  },

  // ^ Need slightly easier level(s) between these two

  {
    rowConditions: [
      {type: 'Contain', numbers: [1, 4, 4, 4 ], suits: []},
      {type: 'Contain', numbers: [1, 1, 2, 3 ], suits: []},
      {type: 'Contain', suits: [white, white, white, blue ], numbers: []},
      {type: 'Contain', suits: [red, red, green, blue ], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', numbers: [1, 1, 1, 4 ], suits: []},
      {type: 'Contain', numbers: [2, 2, 3, 4 ], suits: []},
      {type: 'Contain', suits: [blue, blue, blue, white ], numbers: []},
      {type: 'Contain', suits: [green, green, green, blue ], numbers: []},
    ]
  },

  // Need many easier levels between these two

  {
    rowConditions: [
      {type: 'SumGreaterThan', amount: 11},
      {type: 'OddOrSuit', suit: blue},
      {type: 'Contain', suits: [blue, white, green, red], numbers: []},
      {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
    ],
    colConditions: [
      {type: 'SumGreaterThan', amount: 11},
      {type: 'EvenOrSuit', suit: red},
      {type: 'Contain', suits: [blue, white, green, red], numbers: []},
      {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
    ]
  },

];


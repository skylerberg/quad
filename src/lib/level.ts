import type { Condition } from './condition';
import { red, blue, green, white } from './suit';

export type Level = {
  rowConditions: Array<Condition>,
  colConditions: Array<Condition>,
};

export const levels = [
  {
    rowConditions: [
      {type: 'ContainNumbers', numbers: [4, 4, 4, 3]},
      {type: 'ContainSuits', suits: [blue, white, green, white]},
      {type: 'ContainSuits', suits: [blue, white, green, blue]},
      {type: 'ContainSuits', suits: [red, red, red, red]},
    ],
    colConditions: [
      {type: 'ContainSuits', suits: [green, green, green, red]},
      {type: 'ContainNumbers', numbers: [1, 2, 3, 4]},
      {type: 'ContainNumbers', numbers: [1, 2, 3, 3]},
      {type: 'ContainNumbers', numbers: [1, 2, 4, 4]},
    ]
  },

  {
    rowConditions: [
      {type: 'ContainSuits', suits: [red, red, green, green ]},
      {type: 'ContainSuits', suits: [red, red, green, green ]},
      {type: 'ContainSuits', suits: [white, white, blue, blue ]},
      {type: 'ContainSuits', suits: [white, white, blue, blue ]},
    ],
    colConditions: [
      {type: 'ContainSuits', suits: [red, red, white, white ]},
      {type: 'ContainSuits', suits: [red, red, white, white ]},
      {type: 'ContainSuits', suits: [green, green, blue, blue ]},
      {type: 'ContainSuits', suits: [green, green, blue, blue ]},
    ]
  },

  {
    rowConditions: [
      {type: 'ContainSuits', suits: [red, red, red, green ]},
      {type: 'ContainSuits', suits: [red, green, green, green ]},
      {type: 'ContainSuits', suits: [blue, blue, blue, white ]},
      {type: 'ContainSuits', suits: [white, white, white, blue ]},
    ],
    colConditions: [
      {type: 'ContainSuits', suits: [blue, blue, green, green ]},
      {type: 'ContainSuits', suits: [blue, red, green, white ]},
      {type: 'ContainSuits', suits: [red, green, white, white ]},
      {type: 'ContainSuits', suits: [red, red, blue, white ]},
    ]
  },

  {
    rowConditions: [
      {type: 'ContainNumbers', numbers: [4, 4, 4, 4]},
      {type: 'ContainSuits', suits: [blue, white, green, red]},
      {type: 'ContainSuits', suits: [blue, white, green, red]},
      {type: 'ContainSuits', suits: [blue, white, green, red]},
    ],
    colConditions: [
      {type: 'ContainSuits', suits: [green, green, green, green]},
      {type: 'ContainNumbers', numbers: [1, 2, 3, 4]},
      {type: 'ContainNumbers', numbers: [1, 2, 3, 4]},
      {type: 'ContainNumbers', numbers: [1, 2, 3, 4]},
    ]
  },

  // ^ Need slightly easier level(s) between these two

  {
    rowConditions: [
      {type: 'ContainNumbers', numbers: [1, 4, 4, 4 ]},
      {type: 'ContainNumbers', numbers: [1, 1, 2, 3 ]},
      {type: 'ContainSuits', suits: [white, white, white, blue ]},
      {type: 'ContainSuits', suits: [red, red, green, blue ]},
    ],
    colConditions: [
      {type: 'ContainNumbers', numbers: [1, 1, 1, 4 ]},
      {type: 'ContainNumbers', numbers: [2, 2, 3, 4 ]},
      {type: 'ContainSuits', suits: [blue, blue, blue, white ]},
      {type: 'ContainSuits', suits: [green, green, green, blue ]},
    ]
  },

  // Need many easier levels between these two

  {
    rowConditions: [
      {type: 'SumGreaterThan', amount: 11},
      {type: 'OddOrSuit', suit: blue},
      {type: 'ContainSuits', suits: [blue, white, green, red]},
      {type: 'ContainNumbers', numbers: [1, 2, 3, 4]},
    ],
    colConditions: [
      {type: 'SumGreaterThan', amount: 11},
      {type: 'EvenOrSuit', suit: red},
      {type: 'ContainSuits', suits: [blue, white, green, red]},
      {type: 'ContainNumbers', numbers: [1, 2, 3, 4]},
    ]
  },

];


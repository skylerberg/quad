import type { Condition } from './condition';
import { red, blue, green, white } from './suit';
import type { TileValue } from './tile.ts';
import type { Suit } from './suit.ts';

export const same = 'similar'
export const different = 'dissimilar'

export type Level = {
  rowConditions: Array<Condition>,
  colConditions: Array<Condition>,
  id: string,  // An unchanging ID we use to uniquely identify levels for sessionStorage
  section: 'Tutorial' | 'Floral' | 'Elemental' | 'Celestial',
  name: string | undefined,
};

export const levelFromString = (str: string): Level => {
  return {
    id: str,
    name: str,
    section: 'Floral',
    colConditions: [
      goalFromString(str.slice(0, 4)),
      goalFromString(str.slice(4, 8)),
      goalFromString(str.slice(8, 12)),
      goalFromString(str.slice(12, 16)),
    ],
    rowConditions: [
      goalFromString(str.slice(16, 20)),
      goalFromString(str.slice(20, 24)),
      goalFromString(str.slice(24, 28)),
      goalFromString(str.slice(28, 32)),
    ],
  }
}

const goalFromString = (str: string): Condition => {
  let suits: Array<Suit> = [];
  let ranks: Array<TileValue> = [];
  for (let char of str) {
    const goalPart = goalPartFromString(char);
    if (goalPart == blue || goalPart == green || goalPart == red || goalPart == white) {
      suits.push(goalPart as Suit);
    }
    else {
      ranks.push(goalPart as TileValue);
    }
  }
  return { type: 'Contain', suits, numbers: ranks}
}

const goalPartFromString = (str: string): TileValue | Suit => {
  if (str == 'b') return blue;
  if (str == 'g') return green;
  if (str == 'r') return red;
  if (str == 'w') return white;
  if (str == '1') return 1;
  if (str == '2') return 2;
  if (str == '3') return 3;
  if (str == '4') return 4;
  throw new Error("invalid character for goal part");
}

export const levels = [
  /*
  {
    section: 'Floral',
    id: 'qovSEigDq9',
    name: 'Product of Elimination lesson',
    rowConditions: [
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 1, 1, 3]},
      {type: 'Contain', suits: [], numbers: [2, 2, 2, 3]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 3]},
    ],
    colConditions: [
      {type: 'Contain', suits: [green, green, blue, red], numbers: []},
      {type: 'Contain', numbers: [], suits: [blue, blue, blue, green,]},
      {type: 'Contain', numbers: [], suits: [green, red, red, red]},
      {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
    ]
  },
  */

  { // Condition Based Elimination
    id: 'ozFxjyqX4h',
    name: 'Squares',
    section: 'Tutorial',
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
    id: 'eSIfBuwC1F',
    section: 'Tutorial',
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
    id: 'f7Kc3UQNkU',
    name: 'Elements Only Hard',
    section: 'Tutorial',
    rowConditions: [
      {type: 'Contain', suits: [red, red, green, white], numbers: [ ]},
      {type: 'Contain', suits: [blue, blue, white, white], numbers: []},
      {type: 'Contain', suits: [green, green, white, red], numbers: []},
      {type: 'Contain', suits: [blue, blue, green, red,], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [green, green, white, red], numbers: []},
      {type: 'Contain', suits: [white, white, blue, red], numbers: []},
      {type: 'Contain', suits: [green, green, blue, blue], numbers: []},
      {type: 'Contain', suits: [red, red, white, blue], numbers: []},
    ]
  },

  {
    id: 'I3nisPzcLE',
    section: 'Floral',
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

  {
    section: 'Floral',
    id: 'UuZDwv4ue0',
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

  {
    id: 'GBLEws4vY5',
    name: 'New Easy?',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [], numbers: [1, 1, 1, 1]},
      {type: 'Contain', suits: [red, red, red, blue ], numbers: []},
      {type: 'Contain', suits: [green, green, green, blue ], numbers: []},
      {type: 'Contain', suits: [white, white, white, blue ], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [blue], numbers: [2, 2, 2]},
      {type: 'Contain', suits: [blue], numbers: [3, 3, 3]},
      {type: 'Contain', suits: [blue], numbers: [4, 4, 4]},
      {type: 'Contain', suits: [blue, green, red, red], numbers: []},
    ]
  },


  {  // Single Group Outer Lockout; Multi Group Outer Lockout; Single Group Inner Lockout
    id: '94phGRw1A1',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', numbers: [4, 4, 4, 3], suits: []},
      {type: 'Contain', suits: [blue, green, red, red], numbers: []},
      {type: 'Contain', suits: [blue, red, green, green, ], numbers: []},
      {type: 'Contain', suits: [white, white, white, white], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [blue, blue, blue, white], numbers: []},
      {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
      {type: 'Contain', numbers: [1, 2, 4, 4], suits: []},
      {type: 'Contain', numbers: [1, 2, 3, 3], suits: []},
    ]
  },

  //{
  //  id: 'fR6e3GmG8F',
  //  name: 'Ups and Downs',
  //  section: 'Floral',
  //  rowConditions: [
  //    {type: 'Contain', suits: [], numbers: [1, 1, 4, 4]},
  //    {type: 'Contain', suits: [], numbers: [2, 2, 3, 3]},
  //    {type: 'Contain', suits: [], numbers: [2, 2, 3, 3]},
  //    {type: 'Contain', suits: [blue, green, red, white], numbers: []},
  //  ],
  //  colConditions: [
  //    {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
  //    {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
  //    {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
  //    {type: 'Contain', suits: [green, green, green, green], numbers: []},
  //  ]
  //},

  // Pretty easy
  // Intersection counting argument
  {
    id: 'YldmuQfL1r',
    name: 'Corner1s',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [blue, white ], numbers: [1, 1]},
      {type: 'Contain', suits: [], numbers: [3, 3, 4, 4, ]},
      {type: 'Contain', suits: [ ], numbers: [2, 2, 4, 4]},
      {type: 'Contain', suits: [ green, red], numbers: [1, 1]},
    ],
    colConditions: [
      {type: 'Contain', suits: [red, white], numbers: [1, 1]},
      {type: 'Contain', numbers: [2, 3, 4, 4,], suits: []},
      {type: 'Contain', numbers: [2, 3, 3, 4], suits: []},
      {type: 'Contain', numbers: [1, 1], suits: [green, blue]},
    ]
  },

  {
    id: 'QO8t6YqATT',
    name: 'Each Flower in Each Row',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [], numbers: [1, 1, 1, 2]},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [2, 4, 4, 4]},
      {type: 'Contain', suits: [], numbers: [1, 3, 3, 3]},
      {type: 'Contain', suits: [], numbers: [1, 2, 2, 3]},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
    ]
  },

  {
    id: '0kKNFtv8Y9',
    name: '',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [], numbers: [2, 2, 3, 3]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [green, green, red, red], numbers: []},
      {type: 'Contain', suits: [blue, blue, white, white], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [green, green, white, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 2, 3, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 3]},
      {type: 'Contain', suits: [blue, blue, red, red], numbers: []},
    ]
  },

  {
    id: 'JIxJytBjnI',
    name: 'Medium difficulty?',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [green, green, white, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 3]},
      {type: 'Contain', suits: [], numbers: [1, 2, 4, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 3]},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [green, green, red, red], numbers: []},
      {type: 'Contain', suits: [green, green, red, red], numbers: []},
    ]
  },

  {
    id: 't3PsMt2Qkl',
    name: '',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [blue, green, white, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 2, 2, 3]},
      {type: 'Contain', suits: [blue, red, red, red], numbers: []},
      {type: 'Contain', suits: [red], numbers: [4, 4, 4]},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 1, 1, 3]},
      {type: 'Contain', suits: [green, green, green, red, ], numbers: []},
      {type: 'Contain', suits: [blue, blue, white, red], numbers: []},
      {type: 'Contain', suits: [blue], numbers: [1, 4, 4]},
    ]
  },

  {
    id: 'egHNiuQKmq',
    name: 'One solution',
    section: 'Floral',
    colConditions: [
      {type: 'Contain', suits: [red, red, white, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 3, 4, 4]},
      {type: 'Contain', suits: [green, red, red], numbers: [4]},
      {type: 'Contain', suits: [], numbers: [1, 1, 2, 2,]},
    ],
    rowConditions: [
      {type: 'Contain', suits: [blue, white, white, white, ], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 3, 4, 4]},
      {type: 'Contain', suits: [blue, blue, white], numbers: [3]},
      {type: 'Contain', suits: [], numbers: [1, 1, 1, 3]},
    ],
  },

  {
    id: 'WEpuQDm7kY',
    name: '',
    section: 'Floral',
    colConditions: [
      {type: 'Contain', suits: [blue, blue, blue, red], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 2, 3, 4]},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [3, 3, 4, 4]},
    ],
    rowConditions: [
      {type: 'Contain', suits: [blue, blue, red, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 2, 4, 4]},
      {type: 'Contain', suits: [green, red, red, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 1, 2, 4]},
    ],
  },

  //{
  //  id: 'WEpuQDm7kY',
  //  name: '',
  //  section: 'Floral',
  //  rowConditions: [
  //    {type: 'Contain', suits: [blue, blue, red, white], numbers: []},
  //    {type: 'Contain', suits: [], numbers: [1, 1, 3, 3]},
  //    {type: 'Contain', suits: [green, green, white, red], numbers: []},
  //    {type: 'Contain', suits: [], numbers: [3, 4, 4, 4]},
  //  ],
  //  colConditions: [
  //    {type: 'Contain', suits: [blue, blue, white, white], numbers: []},
  //    {type: 'Contain', suits: [], numbers: [1, 1, 3, 3]},
  //    {type: 'Contain', suits: [green, red, red, red], numbers: []},
  //    {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
  //  ]
  //},
  {
    id: 'yY2LEE4eO0',
    section: 'Floral',
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

  {
    id: 'mYt1sYy17n',
    name: 'New Hard?',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [green, red, red, red, ], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 3]},
      {type: 'Contain', suits: [], numbers: [1, 2, 4, 4]},
    ],
    colConditions: [
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [red, blue, blue, blue], numbers: []},
      {type: 'Contain', suits: [green, green, red, red], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4,]},
    ]
  },

  // Jacob's dad's wife really liked this level
  {
    id: '7yQA1MLZtN',
    name: '',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [green, green, red, white], numbers: []},
      {type: 'Contain', suits: [blue, blue, blue, white ], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 3, 4, 4]},
      {type: 'Contain', suits: [], numbers: [1, 1, 2, 3]},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 1, 2, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
    ]
  },


  // Wild Lawn! This is the a challenging one that I generated randomly
  {
    id: 'YqyBmu49zb',
    name: 'Wild Lawn',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [blue, red, white, white], numbers: []},
      {type: 'Contain', suits: [blue, blue, green, red], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 2, 3, 4]},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 2, 2, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 2, 4]},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [blue, blue, green, white], numbers: []},
    ]
  },

  {
    id: 'fFe5qMFksF',
    name: 'Similarities introduction',
    section: 'Elemental',
    rowConditions: [
      {type: 'Contain', suits: [blue, blue, blue, blue], numbers: []},
      {type: 'Similarities', similarities: {above: same}},
      {type: 'Similarities', similarities: {below: same}},
      {type: 'Contain', suits: [green, green, green, red], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 1, 1, 1]},
      {type: 'Contain', suits: [], numbers: [2, 2, 3, 3]},
      {type: 'Contain', suits: [], numbers: [2, 3, 3, 4]},
      {type: 'Contain', suits: [], numbers: [2, 4, 4, 4]},
    ]
  },

  // Very hard, but actually pretty good; should keep
  {
    id: 'xI3biukHY2',
    name: 'Double Similarities',
    section: 'Elemental',
    rowConditions: [
      {type: 'Contain', suits: [blue, blue, blue, red], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 2, 2, 4]},
      {type: 'Contain', suits: [white, white, white, red], numbers: []},
      {type: 'Contain', suits: [green, green, green, red], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Similarities', similarities: {left: same, right: same}},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 4, 4, 4]},
    ]
  },


  {  // Extremely hard
    id: '0fmwXQHU8w',
    name: '',
    section: 'Elemental',
    rowConditions: [
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Similarities', similarities: {above: same, below: different}},
      {type: 'Contain', suits: [blue, blue, green, red], numbers: []},
      {type: 'Similarities', similarities: {above: different}},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 1, 2, 3]},
      {type: 'Contain', suits: [], numbers: [1, 2, 2, 4]},
      {type: 'Similarities', similarities: {left: same}},
      {type: 'Contain', suits: [blue, blue, green, white], numbers: []},
    ]
  },

  {  // Currently impossible
    id: 'zDv1aYel1v',
    name: '',
    section: 'Elemental',
    rowConditions: [
      {type: 'Similarities', similarities: {below: same}},
      {type: 'Contain', suits: [], numbers: [1, 2, 4, 4]},
      {type: 'Contain', suits: [], numbers: [1, 3, 4, 4]},
      {type: 'Contain', suits: [red, green, green, green], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 2, 2, 2]},
      {type: 'Contain', suits: [green, white, white, white], numbers: []},
      {type: 'Contain', suits: [green, green, blue, red], numbers: []},
      {type: 'Similarities', similarities: {left: same}},
    ]
  },

  // Need many easier levels between these two
  //{
  //  section: 'Celestial',
  //  id: '5AebAwMKZ2',
  //  rowConditions: [
  //    {type: 'SumGreaterThan', amount: 11},
  //    {type: 'OddOrSuit', suit: blue},
  //    {type: 'Contain', suits: [blue, white, green, red], numbers: []},
  //    {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
  //  ],
  //  colConditions: [
  //    {type: 'SumGreaterThan', amount: 11},
  //    {type: 'EvenOrSuit', suit: red},
  //    {type: 'Contain', suits: [blue, white, green, red], numbers: []},
  //    {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
  //  ]
  //},

  // Challenging and fun
  //{
  //  id: 'UroBskL0wy',
  //  name: 'Fireplace',
  //  section: 'Celestial',
  //  rowConditions: [
  //    {type: 'EvenOrSuit', suit: blue},
  //    {type: 'Contain', suits: [red, red, blue, white ], numbers: [ ]},
  //    {type: 'Contain', suits: [ red, red, green, blue ], numbers: [ ]},
  //    {type: 'SumGreaterThan', amount: 13},
  //  ],
  //  colConditions: [
  //    {type: 'EvenOrSuit', suit: green},
  //    {type: 'Contain', numbers: [ ], suits: [red, red, green, white]},
  //    {type: 'Contain', numbers: [ ], suits: [red, red, white, blue ]},
  //    {type: 'Contain', suits: [white, white, blue, blue], numbers: [ ]},
  //  ]
  //},

  levelFromString('bggggbwb23123344b1444222wwgbbrrw'),
  levelFromString('w1221333rbbbwgwgbgrrwgrw41414343'),
  levelFromString('bbrw3334rrrg1121rgwww2232334bggw'),
  levelFromString('gbbggwrrwwrr1143wgwr242231334344'),
  levelFromString('14144433wgwb3wgrbrwgw2231311rrgr'),
  levelFromString('1331gwwrrbrb1344wrwgg444wbwb1121'),
  levelFromString('44443133b232rgbb3141rrrbrbwgbbgw'),
  levelFromString('ggrwrrrbggbb313443434212gwwb1112'),
  levelFromString('43343gbg1311rrgr1441rgbwrbgb3424'),
  levelFromString('1331wgrbrrrw2424gwbb424322231grg'),
  levelFromString('44141311grbrgbwb1133rrwr4232wbbr'),
  levelFromString('rbggbrrbw32234223123rbrbgbgg3444'),
  levelFromString('wrrw3343gwbg3414wgbgbrgg13132412'),
  levelFromString('rbbgwwwb1241rrrb24331414rrbg4121'),
  levelFromString('wggw1411rrbr21324343wgrw43124rww'),
  levelFromString('2134wwwggrrwg112gwgw33331222gbrb'),
  levelFromString('wwrg3332b2311bbbggbgrwbr24114434'),
  levelFromString('gbggbwbb2421g3231112wrbg4443gwrg'),
  levelFromString('bbgw1wwb234242412424rbgb33342rrr'),
  levelFromString('13314424wggbbbwbrrbb4ggr13324342'),
  levelFromString('3311rrrwr332gwggg223bwrrgbbw2111'),
  levelFromString('rggwbrrb4323b3112222rwgrrwbg1411'),
  levelFromString('2142wrwgwwbr3321wbbbrwrr3133b312'),
  levelFromString('wgwwbrrwr44334232411brbg4rbrbggw'),
  levelFromString('wrrr4223wrbb2431rrww4244wggw1131'),
  levelFromString('gggrwrbw1232wrrw23312322r111bwrb'),
  levelFromString('bwbg4wbr13433321grrrwgrw23241211'),
  levelFromString('brbbwrwr3343w244rwww311133142442'),
  levelFromString('rbrr43113brg3314wwrbg34243224wwg'),
  levelFromString('3121bwrr3123rwgg2ggg1441b122bbbw'),
  levelFromString('rbgr24431121wgrr1441grgrr412bggb'),
  levelFromString('wwrg433443131222bbbr2414g311rgrr'),
  levelFromString('bgbg3443r434g1123grg2322wbbgwwbw'),
  levelFromString('243323123rgwwrwwbrgw44132111ggwb'),
  levelFromString('bbbg2113rgrr3334bgbgb2212424rwbr'),
  levelFromString('wgww3442grggrbbw32322444b124gwbg'),
  levelFromString('bbwrb1241131grrb33312212bbrbgwgr'),
  levelFromString('44412242bbww23134221rrbggbwbwgww'),
  levelFromString('3rrw33134221brbrwbwrwwrr44341213'),
  levelFromString('g234b411brwb4433wwwbb1114rrr4344'),
  levelFromString('wwbw2244ggbrb124323342421321rbgr'),
  levelFromString('4gww13232424gwwrwggg4111rwrww221'),
  levelFromString('23322gwr3444rrrgrwggbbbg33142242'),
  levelFromString('14332414brbggbbg1211gwgww4314232'),
  levelFromString('24221wgrwbrw2bwb1341gwggg113brbw'),
  levelFromString('bgbg41332232b2114121gwgg3421wwgb'),
  levelFromString('1333gwrrwbww24214322rbrr4434ggww'),
  levelFromString('3222rbrg1gbb14114134wgwggbww3brb'),
  levelFromString('bggbbbrw3311434234444331rgwrbbgg'),
  levelFromString('13222wwwrggr11322342grgb4311rrwr'),
  levelFromString('3433bbrr3rgg2442brbb1wgg34312144'),
  levelFromString('1333rwww4221rgrrrwgw12332142ggwg'),
  levelFromString('1221brbw42241333wbwwrgwgrbbb3322'),
  levelFromString('brbgbgww344413322124rrbrggww1311'),
  levelFromString('23244311wwwrbbrrg2112244wrbwbrbb'),
  levelFromString('wwwbrgbg13314334g121brgr3221rbbw'),
  levelFromString('34224314gwggwwrrrbgg14114433bbgw'),
  levelFromString('2342grbrbwgb13431134rrrg2422gwww'),
  levelFromString('1rgw33131222grgg2131grbr4212brwb'),
  levelFromString('1rbrr3224442rbwbr332bgrbg331wgwg'),
  levelFromString('2wrr13142442rgbggbgggbbr4411b422'),
  levelFromString('43344ggwwbgg42222333gwbg2131rrrw'),
  levelFromString('bbww4wrr44331114gwbb3343rgww1231'),
  levelFromString('b134gbwgrrbb11134gwwggbb22121431'),
  levelFromString('4344wrrrw332bbwwgrgbb1242333bwgb'),
  levelFromString('34114321ggrgbrrrwbrw2122w4134411'),
  levelFromString('wrrw2312bgbb4424gwbbw21333322gww'),
  levelFromString('g442wwrg2323gbwgrwbg33132243gwwr'),
  levelFromString('3323rbbg2444wbgbw422rbrbwwwr1124'),
  levelFromString('4bbrrwww2444rbgr3322bwrbbrggr133'),
  levelFromString('wrrw24423144gbgg1232wwgw3344rbwr'),

];

// Unused ids for your convenience
    //id: 'FN2geIQ2yV',
    //id: 'Xc8dddTBWt',
    //id: 'kwbp3lTt7H',
    //id: '7f4SMZvdRl',
    //id: 'LgcTWrovNv',
    //id: '5T4Ap4m1Db',
    //id: 'ql66ChyZVY',
    //id: 's0EzQDUrrp',
    //id: 'MJM3d7sckV',
    //id: 'ZEDru8hn5S',
    //id: 'BCg3ESCCII',
    //id: '9KiDs5fXJc',
    //id: '5m53LCX9VH',
    //id: '2YNvPPN4LZ',
    //id: 'rcE7Qqy1l5',
    //id: 'oVpwXNSauy',
    //id: 'WL89N7ad3U',
    //id: 'grta0gLCBh',
    //id: 'jaS0F0Eotn',
    //id: 'XXVWJHtLWH',
    //id: 'yjnIVSDoR4',
    //id: '0IQeg8U6Sy',
    //id: 'LpnfjRfmYr',
    //id: '7Mp1YKAzLa',
    //id: '9HzddRv4Kj',
    //id: 'YcXBmklFN4',
    //id: 'UA2jvf0Qwa',
    //id: 'oIZmh4KWct',
    //id: 'tecxBvQYOh',
    //id: 'XsuIeBcOil',
    //id: 'ASt88GAk1H',
    //id: 'VGcURgwnFy',
    //id: 'UCKnwmHYsX',
    //id: 'iBheQe2ehy',
    //id: '1CfEmfTMgX',
    //id: 'QHN0MrNFze',
    //id: 'fMSf1lns4H',
    //id: '0mwj5CyBrE',
    //id: 'iUgja3QgmN',
    //id: 'nt3BmVviuh',
    //id: 'JY0pTJoRyl',
    //id: 'IkbThpSCYV',
    //id: 'JqBcGFNX91',
    //id: 'wsgQX53j69',
    //id: 'wQtBq6hzbf',
    //id: 'rq3wUNuAAe',
    //id: 'DAydGDBmv1',
    //id: 'jmT4KhcTUC',
    //id: '4xy4Q64rcR',
    //id: '7W24MZg7xC',
    //id: '6Fw3UugpFV',
    //id: 'kzjr5XaZzg',
    //id: 'uXyui0OJ8R',
    //id: 'kQXQ6fUvbm',
    //id: 'rVr2YyO0sl',
    //id: 's0bG6hH8BZ',
    //id: '7IIfbFiU2s',
    //id: 'bcFg7BdJRw',
    //id: 'e7E1kzxyy1',
    //id: '1Ks1uql62I',
    //id: 'Wj2RazeIJt',
    //id: '7NTMW9cHCF',
    //id: 't0ZYD0lygU',
    //id: 'hmsjToSph4',
    //id: '0gbgEeSoxL',
    //id: 'JWF1HZvWC0',
    //id: 'tfpheFvtRo',
    //id: 'VRjan3C7sa',
    //id: 'H4eKbiSTWv',
    //id: 'mlV4fSjwax',
    //id: 'vzJvTSRmrl',
    //id: 'jaXkZmOvpe',
    //id: '0nNGtQvRy9',
    //id: 'ldwoFxCuGN',

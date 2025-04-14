import type { Condition } from './condition';
import { red, blue, green, white } from './suit';

let same = 'similar'
let different = 'dissimilar'

export type Level = {
  rowConditions: Array<Condition>,
  colConditions: Array<Condition>,
  id: string,  // An unchanging ID we use to uniquely identify levels for sessionStorage
  section: 'Tutorial' | 'Floral' | 'Elemental' | 'Celestial',
  name: string | undefined,
};

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

  {  // Single Group Outer Lockout; Multi Group Outer Lockout; Single Group Inner Lockout
    id: '94phGRw1A1',
    section: 'Floral',
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
      {type: 'Contain', suits: [blue], numbers: [2, 3, 4]},
    ]
  },

  {
    id: 'fR6e3GmG8F',
    name: 'Ups and Downs',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [], numbers: [1, 1, 4, 4]},
      {type: 'Contain', suits: [], numbers: [2, 2, 3, 3]},
      {type: 'Contain', suits: [], numbers: [2, 2, 3, 3]},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
      {type: 'Contain', suits: [green, green, green, green], numbers: []},
    ]
  },

  // Pretty easy
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
      {type: 'Contain', suits: [], numbers: [2, 3, 4, 4]},
      {type: 'Contain', suits: [], numbers: [1, 3, 3, 4]},
      {type: 'Contain', suits: [], numbers: [1, 1, 2, 4]},
      {type: 'Contain', suits: [], numbers: [1, 2, 2, 3]},
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
      {type: 'Contain', suits: [], numbers: [1, 3, 4, 4]},
    ],
    colConditions: [
      {type: 'Contain', suits: [], numbers: [1, 1, 3, 3]},
      {type: 'Contain', suits: [green, green, red, white], numbers: []},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 2, 4, 4]},
    ]
  },

  {
    id: 'egHNiuQKmq',
    name: 'New Medium?',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [blue, blue, white, white, ], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 3, 4, 4]},
      {type: 'Contain', suits: [blue, green, red, white, ], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 1, 2, 3]},
    ],
    colConditions: [
      {type: 'Contain', suits: [red, red, white, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [2, 3, 4, 4]},
      {type: 'Contain', suits: [blue, green, red, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 1, 2, 3,]},
    ]
  },

  {
    id: 'WEpuQDm7kY',
    name: '',
    section: 'Floral',
    rowConditions: [
      {type: 'Contain', suits: [blue, blue, red, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 1, 3, 3]},
      {type: 'Contain', suits: [green, green, white, red], numbers: []},
      {type: 'Contain', suits: [], numbers: [3, 4, 4, 4]},
    ],
    colConditions: [
      {type: 'Contain', suits: [blue, blue, white, white], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 1, 3, 3]},
      {type: 'Contain', suits: [green, red, red, red], numbers: []},
      {type: 'Contain', suits: [], numbers: [1, 2, 3, 4]},
    ]
  },

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
    //id: 'xI3biukHY2',

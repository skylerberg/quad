import type { Condition } from './condition';
import { red, blue, green, white } from './suit';

export type Level = {
  rowConditions: Array<Condition>,
  colConditions: Array<Condition>,
  id: string,  // An unchanging ID we use to uniquely identify levels for sessionStorage
};

export const levels = [

  //{
  //  id: 'UuZDwv4ue0',
  //  rowConditions: [
  //    {type: 'Contain', suits: [blue, blue], numbers: [1, 1]},
  //    {type: 'Contain', suits: [blue, blue, white], numbers: [1]},
  //    {type: 'Contain', suits: [green, white, green, white], numbers: []},
  //    {type: 'Contain', suits: [red, red, red, red], numbers: []},
  //  ],
  //  colConditions: [
  //    {type: 'Contain', suits: [green, green, green, red], numbers: []},
  //    {type: 'Contain', numbers: [3, 4], suits: [blue, blue]},
  //    {type: 'Contain', numbers: [1, 1], suits: [blue, blue]},
  //    {type: 'Contain', numbers: [], suits: [white, white, white, red]},
  //  ]
  //},

  //{  // Single Group Outer Lockout; Multi Group Outer Lockout; Single Group Inner Lockout
  //  id: '94phGRw1A1',
  //  rowConditions: [
  //    {type: 'Contain', numbers: [4, 4, 4, 3], suits: []},
  //    {type: 'Contain', suits: [blue, white, green, white], numbers: []},
  //    {type: 'Contain', suits: [blue, white, green, blue], numbers: []},
  //    {type: 'Contain', suits: [red, red, red, red], numbers: []},
  //  ],
  //  colConditions: [
  //    {type: 'Contain', suits: [green, green, green, red], numbers: []},
  //    {type: 'Contain', numbers: [1, 2, 3, 4], suits: []},
  //    {type: 'Contain', numbers: [1, 2, 3, 3], suits: []},
  //    {type: 'Contain', numbers: [1, 2, 4, 4], suits: []},
  //  ]
  //},

  { // Condition Based Elimination
    id: 'ozFxjyqX4h',
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
    id: 'I3nisPzcLE',
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
    id: 'yY2LEE4eO0',
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

// Unused ids for your convenience
    //id: '0fmwXQHU8w',
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
    //id: 'fFe5qMFksF',
    //id: 'zDv1aYel1v',
    //id: 'JIxJytBjnI',
    //id: 'WEpuQDm7kY',
    //id: 'QO8t6YqATT',
    //id: 'fR6e3GmG8F',
    //id: '0kKNFtv8Y9',
    //id: 'qovSEigDq9',
    //id: 't3PsMt2Qkl',
    //id: '7yQA1MLZtN',
    //id: '5AebAwMKZ2',
    //id: 'YqyBmu49zb',
    //id: 'UroBskL0wy',
    //id: 'YldmuQfL1r',
    //id: 'f7Kc3UQNkU',
    //id: 'mYt1sYy17n',
    //id: 'egHNiuQKmq',
    //id: 'GBLEws4vY5',

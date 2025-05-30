import type { Goal } from './goal';
import { red, blue, green, white } from './tile';
import type { Tile, Rank, Suit } from './tile';

export type Level = {
  rowGoals: Array<Goal>,
  colGoals: Array<Goal>,
  id: string,  // An unchanging ID we use to uniquely identify levels for sessionStorage
  section: 'Tutorial' | 'Floral' | 'Elemental' | 'Celestial',
  name: string | undefined,
  hints: Array<Array<Tile | null>>,
};

export type Difficulty = 'Tutorial1' | 'Tutorial2' | 'Tutorial3' | 'Casual' | 'Challenge' | 'Extreme';

export const levelFromString = (goals: string, hintString: string | undefined): Level => {
  const colGoals = [
    goalFromString(goals.slice(0, 4)),
    goalFromString(goals.slice(4, 8)),
    goalFromString(goals.slice(8, 12)),
    goalFromString(goals.slice(12, 16)),
  ];
  const rowGoals = [
    goalFromString(goals.slice(16, 20)),
    goalFromString(goals.slice(20, 24)),
    goalFromString(goals.slice(24, 28)),
    goalFromString(goals.slice(28, 32)),
  ];
  const hints: Array<Array<Tile | null>> = [];
  for (let row = 0; row < 4; row++) {
    hints.push([]);
    for (let col = 0; col < 4; col++) {
      hints[row].push(null);
    }
  }
  if (hintString) {
    for (let i = 0; i < hintString.length; i += 4) {
      let hint = hintString.slice(i, i + 4);
      let row = Number.parseInt(hint[0]);
      let col = Number.parseInt(hint[1]);
      let suit = hint[2] as Suit;
      let rank = Number.parseInt(hint[3]) as Rank;
      hints[row][col] = { suit, rank };
    }
  }
  return {
    id: goals,
    name: goals,
    section: 'Floral',
    colGoals: colGoals,
    rowGoals: rowGoals,
    hints,
  }
}

const goalFromString = (str: string): Goal => {
  let suits: Array<Suit> = [];
  let ranks: Array<Rank> = [];
  for (let char of str) {
    const goalPart = goalPartFromString(char);
    if (goalPart == blue || goalPart == green || goalPart == red || goalPart == white) {
      suits.push(goalPart as Suit);
    }
    else {
      ranks.push(goalPart as Rank);
    }
  }
  ranks.sort();
  suits.sort();
  return { suits, ranks}
}

const goalPartFromString = (str: string): Rank | Suit => {
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
  levelFromString('4rbb4344g1123rrr1311g433ggbgwrww', '01B313R323G220B2'),
  levelFromString('gw4wbbggw2222333rbbb1brr1132wr31'),
  // New crop with only 1 solution


  // Crop from when I visited jacob, 1 to 8 solutions
  levelFromString('2142wrwgww4r3344wbbbrwrr3133b312'),
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
];

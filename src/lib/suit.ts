export type Suit = '🔥' | '🌊' | '🌪️' | '🌱';

export const red: Suit = '🔥';
export const blue: Suit = '🌊';
export const white: Suit = '🌪️';
export const green: Suit = '🌱';

export function suitSymbolToName(suit: Suit): string {
  if (suit === red) {
    return 'red';
  }
  else if (suit === blue) {
    return 'blue';
  }
  else if (suit === white) {
    return 'white';
  }
  return 'green';
}

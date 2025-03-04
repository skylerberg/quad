import tulip from '../assets/tulip.svg';
import daisy from '../assets/daisy.svg';
import lotus from '../assets/lotus.svg';
import rose from '../assets/rose.svg';

export type Suit = '🔥' | '🌊' | '🌪️' | '🌱';

export const red: Suit = '🔥';
export const blue: Suit = '🌊';
export const white: Suit = '🌪️';
export const green: Suit = '🌱';

export const allSuits = [red, blue, white, green];

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

export function getSuitIcon(suit: Suit): string {
  if (suit === red) {
    return rose;
  }
  else if (suit === blue) {
    return lotus;
  }
  else if (suit === white) {
    return daisy;
  }
  return tulip;
}

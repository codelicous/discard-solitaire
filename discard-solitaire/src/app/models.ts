export interface Card {
  type: CardType;
  value: number;
  img: string;
  isShown: boolean;
}

export enum CardType {
  Heart,
  Spade,
  Club,
  Diamond
}

export const cardValue = {
  ace : 1,
  2 : 2,
  3 : 3,
  4 : 4,
  5 : 5,
  6: 6,
  7 : 7,
  8 : 8,
  9 : 9,
  10 : 10,
  jack : 11,
  queen : 12,
  king : 13
}
export function enumToArrayNumericValues<T>(enumObject: T): Array<T[keyof T]> {
  return Object.values(enumObject).filter(v => !(typeof v === 'string'));
}

export function enumToArrayKeys<T>(enumObject: T): Array<keyof T> {
  return Object.values(enumObject).filter(v => typeof v === 'string');
}

export function calcRandomPosition() {
  return Math.floor(Math.random() * (52))
}


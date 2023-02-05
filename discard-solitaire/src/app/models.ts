export interface Card {
  type: CardType;
  value: CardValue;
}

export enum CardType {
  Heart,
  Spade,
  Club,
  Diamond
}

export enum CardValue {
  Ace = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13
}

export function enumToArrayNumericValues<T>(enumObject: T): Array<T[keyof T]> {
  return Object.values(enumObject).filter(v => !(typeof v === 'string'));
}

export function calcRandomPosition() {
  return Math.floor(Math.random() * (52))
}


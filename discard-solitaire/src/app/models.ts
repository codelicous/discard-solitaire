import _ from 'lodash-es';
export interface Card {
  type: CardType;
  value: number;
  img: string;
}

export enum CardType {
  Heart,
  Spade,
  Club,
  Diamond
}
export enum UtilClasses {
  Marked = 'marked'
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
export const cardValueToCardName = _.invert(cardValue);

export function enumToArrayNumericValues<T>(enumObject: T): number[] {
  return Object.values(enumObject as any).filter(v => !(typeof v === 'string')) as number[];
}

export function enumToArrayKeys<T>(enumObject: T): string[] {
  return Object.values(enumObject as any).filter(v => typeof v === 'string') as string[];
}

export interface GameState {
  deck: Card[];
  cardStacks:  Card[][];
  moveState: number;
  discarded: number;
  undoNumber: number,
  undoRedoMove: number,
  discardedBeforeDeal: number
}

export enum DifficultyType  {
  Not,
  Easy,
  Normal,
  Hard,
  Hardest
}

export enum SessionStorageKey {
  GameState = 'solitaire_gameState',
  Difficulty = 'solitaire_difficulty'
}
export const difficultyKeys = _.invert(DifficultyType);

export  enum DataBaseConfigData {
  collectionName = 'discard-solitaire',

}

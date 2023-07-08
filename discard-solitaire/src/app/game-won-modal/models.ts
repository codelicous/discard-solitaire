import { Score } from '../high-scores/models';

export interface DialogData {
  score: number;
  higScores: Score[];
  topTenEligible: boolean;
}

export enum DialogDestination {
  NewGame,
  Home,
  HighScores
}

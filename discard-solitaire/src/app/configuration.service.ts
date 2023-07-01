import { Injectable } from '@angular/core';
import { DifficultyType, GameState } from "./models";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public selectedDifficulty: DifficultyType;
  public savedGameState: GameState;
}

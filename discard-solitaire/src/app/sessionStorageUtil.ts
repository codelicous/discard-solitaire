import { DifficultyType, GameState, SessionStorageKey } from "./models";

export class SessionStorageUtil {
  public static saveGameState(gamesState: GameState): void {
    sessionStorage.setItem(SessionStorageKey.GameState, JSON.stringify(gamesState));
  }
  public static saveGameDifficulty(difficulty: DifficultyType): void {
    sessionStorage.setItem(SessionStorageKey.Difficulty, JSON.stringify(difficulty));
  }

  public static getGameState(): GameState| undefined {
    const gameState = sessionStorage.getItem(SessionStorageKey.GameState);
    return gameState && JSON.parse(gameState);
  }

  public static getGameDifficulty(): DifficultyType| undefined {
    const difficulty = sessionStorage.getItem(SessionStorageKey.Difficulty);
    return difficulty && JSON.parse(difficulty);
  }
  public static reset(): void {
    sessionStorage.clear();
  }
}

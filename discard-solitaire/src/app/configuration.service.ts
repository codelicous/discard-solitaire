import { Injectable } from '@angular/core';
import {DifficultyType} from "./models";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public selectedDifficulty = DifficultyType.Easy;
  constructor() { }
}

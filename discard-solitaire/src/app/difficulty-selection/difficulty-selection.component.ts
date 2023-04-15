import {Component} from '@angular/core';
import {difficultyKeys, DifficultyType} from "../models";
import {ConfigurationService} from "../configuration.service";
import {RoutesNames} from "../app.module";
import {Router} from "@angular/router";

@Component({
  selector: 'app-difficulty-selection',
  templateUrl: './difficulty-selection.component.html',
  styleUrls: ['./difficulty-selection.component.scss']
})
export class DifficultySelectionComponent {
  public readonly difficultTypeEnum = DifficultyType;
  public readonly homeRoute = RoutesNames.Home;
  public readonly gameRoute = RoutesNames.Game;
  public readonly difficultyKeys = difficultyKeys;
  constructor(public configurationService: ConfigurationService,
              private router: Router) {
  }
  public selectDifficulty(selection: DifficultyType): void {
    this.configurationService.selectedDifficulty = selection;
  }
  public navigate(route: RoutesNames.Home | RoutesNames.Game): void {
    this.router.navigate([route]);
  }
}

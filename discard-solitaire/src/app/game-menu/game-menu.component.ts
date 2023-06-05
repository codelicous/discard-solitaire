import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RoutesNames} from "../app.module";
import {ConfigurationService} from "../configuration.service";
import {SessionStorageUtil} from "../sessionStorageUtil";

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit{

  constructor(private router: Router,
              private configurationService: ConfigurationService) {
  }

  public ngOnInit(): void {
    this.configurationService.selectedDifficulty = null;
    SessionStorageUtil.reset();
  }

  public startGame(): void {
    this.router.navigate([RoutesNames.DifficultySelection]);
  }

  public howToPlay(): void {
    window.open('http://www.solitairecentral.com/rules/IdiotsDelight.html', '_blank', 'noopener,noreferrer');
  }

  public difficultySelection():void {
    this.router.navigate([RoutesNames.DifficultySelection])
  }
}

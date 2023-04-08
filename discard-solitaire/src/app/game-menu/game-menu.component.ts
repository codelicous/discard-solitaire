import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {RoutesNames} from "../app.module";

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent {

  constructor(private router: Router) {
  }

  public startGame(): void {
    this.router.navigate([RoutesNames.DifficultySelection]).then(console.log);
  }

  public howToPlay(): void {
    window.open('http://www.solitairecentral.com/rules/IdiotsDelight.html', '_blank', 'noopener,noreferrer');
  }

  public difficultySelection():void {
    this.router.navigate([RoutesNames.DifficultySelection])
  }
}

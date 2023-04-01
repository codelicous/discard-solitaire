import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent {

  constructor(private router: Router) {
  }

  public startGame(): void {
    this.router.navigate(['game']).then(console.log);
  }

  howToPlay() {
    window.open('http://www.solitairecentral.com/rules/IdiotsDelight.html', '_blank', 'noopener,noreferrer');
  }
}

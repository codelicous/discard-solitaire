import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageUtil } from '../../sessionStorageUtil';

@Component({
  selector: 'app-game-controller',
  templateUrl: './game-controller.component.html',
  styleUrls: [ './game-controller.component.scss' ]
})
export class GameControllerComponent {
  @Output() public undoEmitter = new EventEmitter<never>();
  @Output() public resetEmitter = new EventEmitter<never>();

  constructor(private router: Router) {
  }

  public undo(): void {
    this.undoEmitter.emit();
  }

  public reset(): void {
    this.resetEmitter.emit();
  }
  public mainMenu(): void {
    SessionStorageUtil.reset();
    SessionStorageUtil.saveGameState(null );
    SessionStorageUtil.saveGameDifficulty(null);
    this.router.navigate([ 'home' ]);
  }
}

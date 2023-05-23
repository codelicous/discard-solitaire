import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";
import {SessionStorageUtil} from "../../sessionStorageUtil";

@Component({
  selector: 'app-game-controller',
  templateUrl: './game-controller.component.html',
  styleUrls: ['./game-controller.component.scss']
})
export class GameControllerComponent {
  @Output() public onUndo = new EventEmitter<never>();
  @Output() public onRedo = new EventEmitter<never>();
  @Output() public onReset = new EventEmitter<never>();

  constructor(private router: Router) {
  }

  public undo(): void {
    this.onUndo.emit();
  }
  public reDo(): void{
    this.onRedo.emit();
  }
  public reset(): void {
    this.onReset.emit();
  }
  public mainMenu(): void {
    SessionStorageUtil.reset();
    SessionStorageUtil.saveGameState(null );
    SessionStorageUtil.saveGameDifficulty(null);
    this.router.navigate(['home']);
  }
}

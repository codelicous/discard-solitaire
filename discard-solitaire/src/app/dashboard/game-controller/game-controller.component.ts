import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-game-controller',
  templateUrl: './game-controller.component.html',
  styleUrls: ['./game-controller.component.scss']
})
export class GameControllerComponent {
  @Output() public onUndo = new EventEmitter<never>();
  @Output() public onRedo = new EventEmitter<never>();
  @Output() public onReset = new EventEmitter<never>();
  public undo(): void {
    this.onUndo.emit();
  }
  public reDo(){
    this.onRedo.emit();
  }
  public reset() {
    this.onReset.emit();

  }
}

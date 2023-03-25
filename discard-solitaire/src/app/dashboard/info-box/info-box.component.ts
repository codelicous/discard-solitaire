import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent {

  @Input() public cardsLeft: number;
  @Input() public discarded: number;

  @Input()
  public set largestRunSetter(currentValue: number) {
    if (currentValue > this.largestRun) {
      this.largestRun = currentValue
    }
  };

  public largestRun = 0;
}

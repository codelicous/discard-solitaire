import {Component, Input} from '@angular/core';
import {difficultyKeys} from "../../models";
import {ConfigurationService} from "../../configuration.service";

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

  public readonly difficultyLevel: string;

  constructor(private configurationService: ConfigurationService) {
    this.difficultyLevel = difficultyKeys[this.configurationService.selectedDifficulty];
  }

  public largestRun = 0;
}

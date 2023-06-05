import {Component, Input, OnInit} from '@angular/core';
import {difficultyKeys} from "../../models";
import {ConfigurationService} from "../../configuration.service";
import {MatDialog} from "@angular/material/dialog";
import {EffectiveRulesComponent} from "../../difficulty-selection/effective-rules/effective-rules.component";

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit{

  @Input() public cardsLeft: number;
  @Input() public discarded: number;

  @Input()
  public set largestRunSetter(currentValue: number) {
    if(currentValue === 999) {
      this.largestRun = 0;
      return;
    }
    if (currentValue > this.largestRun) {
      this.largestRun = currentValue
    }
  };

  public difficultyLevel: string;

  constructor(private configurationService: ConfigurationService,
              private matDialog: MatDialog)  {
  }

  public ngOnInit(): void {
    this.difficultyLevel = difficultyKeys[this.configurationService.selectedDifficulty];
  }

  public largestRun = 0;

  public openRulesModal() {
    this.matDialog.open(EffectiveRulesComponent, {data: {isInModal: true}});
  }
}

import { Component, Input } from '@angular/core';
import { DifficultyType, difficultyKeys } from '../../models';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-effective-rules',
  templateUrl: './effective-rules.component.html',
  styleUrls: [ './effective-rules.component.scss' ]
})
export class EffectiveRulesComponent {
  @Input() showDifficulty: boolean;

  public readonly difficultyKeys = difficultyKeys;
  public readonly difficultTypeEnum = DifficultyType;
  constructor(public configurationService: ConfigurationService) {
  }
}

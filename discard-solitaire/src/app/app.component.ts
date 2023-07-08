import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { RoutesNames } from './app.module';
import { ConfigurationService } from './configuration.service';
import { SessionStorageUtil } from './sessionStorageUtil';
import { DeviceValidationService } from './device-validation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  public isMobile: boolean;

  constructor(private router: Router,
              private configurationService: ConfigurationService,
              private deviceValidationService: DeviceValidationService) {
  }

  ngOnInit(): void {
    this.isMobile = this.deviceValidationService.isMobile();
    this.checkGameState();

  }

  private checkGameState(): void {
    const difficulty = SessionStorageUtil.getGameDifficulty();
    const gameState = SessionStorageUtil.getGameState();
    if (gameState && difficulty) {
      this.configurationService.selectedDifficulty = difficulty;
      this.configurationService.savedGameState = gameState;
      this.router.navigate([ RoutesNames.Game ]);
    } else  {
      this.router.navigate([ RoutesNames.Home ]);
    }
  }
}

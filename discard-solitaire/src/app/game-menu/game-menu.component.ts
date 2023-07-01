import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesNames } from '../app.module';
import { noop } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { SessionStorageUtil } from '../sessionStorageUtil';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: [ './game-menu.component.scss' ]
})
export class GameMenuComponent implements OnInit {
  @HostBinding('class.loading')
    isLoading = false;

  constructor(private router: Router,
              private configurationService: ConfigurationService) {
  }

  public ngOnInit(): void {
    this.configurationService.selectedDifficulty = null;
    SessionStorageUtil.reset();
  }F

  public startGame(): void {
    this.handleNavigation(RoutesNames.DifficultySelection);
  }
  public navigateToHighScores() {
    this.presentLoader();
    this.router.navigate([ RoutesNames.HighScores ])
  }

  private handleNavigation(routeName: RoutesNames): void {
    this.router.navigate([ routeName ])
      .then(noop)
      .catch(console.log)
  }

  private presentLoader() {
    this.isLoading = true
  }
}

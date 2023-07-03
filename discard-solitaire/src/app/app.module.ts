import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { RouterModule, Routes } from '@angular/router';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { DifficultySelectionComponent } from './difficulty-selection/difficulty-selection.component';
import { GameWonModalComponent } from './game-won-modal/game-won-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EffectiveRulesComponent } from './difficulty-selection/effective-rules/effective-rules.component';
import { MatTooltipModule } from '@angular/material/tooltip';

export enum RoutesNames  {
  Home = 'home',
  Game = 'game',
  HowToPlay = 'how-to-play',
  DifficultySelection = 'difficulty-selection',
  HighScores = 'high-scores'
}

const routes: Routes = [
  { path: '', component: GameMenuComponent },
  { path: RoutesNames.Home, component: GameMenuComponent },
  { path: RoutesNames.Game, loadChildren: () => import('../app/dashboard/dashboard.module').then(module => module.DashboardModule) },
  { path: RoutesNames.HowToPlay, component: HowToPlayComponent },
  { path: RoutesNames.DifficultySelection, component: DifficultySelectionComponent },
  { path: RoutesNames.HighScores , loadChildren: ()=> import('./high-scores/high-scores.module').then(module => module.HighScoresModule) }
];

@NgModule({
  declarations: [
    AppComponent,
    GameMenuComponent,
    HowToPlayComponent,
    DifficultySelectionComponent,
    GameWonModalComponent,
    EffectiveRulesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RouterModule.forRoot(routes),
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

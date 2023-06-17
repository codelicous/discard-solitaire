import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardStacksComponent } from './dashboard/card-stacks/card-stacks.component';
import { InfoBoxComponent } from './dashboard/info-box/info-box.component';
import { GameControllerComponent } from './dashboard/game-controller/game-controller.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import {RouterModule, Routes} from "@angular/router";
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { DifficultySelectionComponent } from './difficulty-selection/difficulty-selection.component';
import { GameWonModalComponent } from './game-won-modal/game-won-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import { EffectiveRulesComponent } from './difficulty-selection/effective-rules/effective-rules.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { HighScoresComponent } from './high-scores/high-scores.component';

export enum RoutesNames  {
  Home = 'home',
  Game = 'game',
  HowToPlay = 'how-to-play',
  DifficultySelection = 'difficulty-selection',
  HighScores = 'high-scores'
}

const routes: Routes = [
  { path: '', component: GameMenuComponent },
  { path: RoutesNames.Home, component: GameMenuComponent},
  { path: RoutesNames.Game, component: DashboardComponent },
  { path: RoutesNames.HowToPlay, component: HowToPlayComponent },
  { path: RoutesNames.DifficultySelection, component: DifficultySelectionComponent },
  { path: RoutesNames.HighScores , component: HighScoresComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CardStacksComponent,
    InfoBoxComponent,
    GameControllerComponent,
    GameMenuComponent,
    HowToPlayComponent,
    DifficultySelectionComponent,
    GameWonModalComponent,
    EffectiveRulesComponent,
    HighScoresComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RouterModule.forRoot(routes),
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

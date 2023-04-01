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


const routes: Routes = [
  { path: '', component: GameMenuComponent },
  { path: 'home', component: GameMenuComponent},
  { path: 'game', component: DashboardComponent },
  { path: 'how-to-play', component: HowToPlayComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CardStacksComponent,
    InfoBoxComponent,
    GameControllerComponent,
    GameMenuComponent,
    HowToPlayComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DragDropModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

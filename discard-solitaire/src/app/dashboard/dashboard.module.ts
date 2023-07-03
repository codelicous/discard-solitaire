import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CardStacksComponent } from './card-stacks/card-stacks.component';
import { GameControllerComponent } from './game-controller/game-controller.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations:[
    DashboardComponent,
    CardStacksComponent,
    GameControllerComponent,
    InfoBoxComponent

  ],
  imports:[ DragDropModule,
    DashboardRoutingModule,
    CommonModule
  ],
  exports: [ DashboardComponent ]
})
export class DashboardModule {
}

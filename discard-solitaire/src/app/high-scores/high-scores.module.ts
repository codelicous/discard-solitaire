import { NgModule } from '@angular/core';
import { HighScoresComponent } from './high-scores.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HighScoresRoutingModule } from './high-scores-routing.module';

@NgModule({
  declarations:[ HighScoresComponent ],
  imports:  [
    MatTableModule,
    CommonModule,
    HighScoresRoutingModule
  ],
  exports:[ HighScoresComponent ]
})
export class HighScoresModule {
}

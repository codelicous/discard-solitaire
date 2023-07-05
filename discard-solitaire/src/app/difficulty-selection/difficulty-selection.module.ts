import { NgModule } from '@angular/core';
import { DifficultySelectionComponent } from './difficulty-selection.component';
import { EffectiveRulesComponent } from './effective-rules/effective-rules.component';
import { CommonModule } from '@angular/common';
import { DifficultySelectionRoutingModule } from './difficulty-selection-routing.module';

@NgModule({
  declarations:[
    DifficultySelectionComponent,
    EffectiveRulesComponent
  ],
  imports:[ CommonModule,
    DifficultySelectionRoutingModule ],
  exports:[ DifficultySelectionComponent ]
})
export class DifficultySelectionModule {
}

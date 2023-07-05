import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DifficultySelectionComponent } from './difficulty-selection.component';


const routes: Routes = [ { path: '', component: DifficultySelectionComponent } ];
@NgModule({
  imports:[ RouterModule.forChild(routes) ],
  exports:[ RouterModule ]
})
export class DifficultySelectionRoutingModule {
}

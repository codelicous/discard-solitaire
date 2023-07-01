import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { HighScoresComponent } from './high-scores.component';
import { inject, NgModule } from '@angular/core';
import { from } from 'rxjs';
import { Score } from './models';
import { FirebaseService } from '../firebase.service';

export const highScoresResolver: ResolveFn< Score[]> = () =>
  from(inject(FirebaseService).getAllScores())
const routes: Routes = [ {
  path:'',
  component: HighScoresComponent,
  resolve: { highScores: highScoresResolver }
} ]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports:  [ RouterModule ]
})
export class HighScoresRoutingModule {
}

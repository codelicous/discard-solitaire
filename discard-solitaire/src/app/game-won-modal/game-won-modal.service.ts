import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from '../firebase.service';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { ConfigurationService } from '../configuration.service';
import { DialogData } from './models';
import { Score } from '../high-scores/models';

@Injectable({
  providedIn: 'root'
})
export class GameWonModalService {
  constructor(private matDialog: MatDialog,
              private fireBaseService: FirebaseService,
              private configurationService: ConfigurationService) {
  }
  public gameWonModalRef(score: number): Observable<DialogData> {
    const  gameWonModalComponentImport: Observable<any> = from(import('../game-won-modal/game-won-modal.component'));
    return forkJoin([ gameWonModalComponentImport,
      this.fireBaseService.getAllScores() ]).pipe(
      mergeMap(payload => this.openModal(...payload, score)
      ));
  }
  private openModal({ GameWonModalComponent }, highScores, score): Observable<DialogData> {
    const topTenEligible = this.getTopTenEligible(score, highScores);
    this.configurationService.isLoading = false
    return this.matDialog.open(GameWonModalComponent, { disableClose: true, data: { score, highScores, topTenEligible } }).afterClosed();
  }

  private getTopTenEligible(score: number, highScores: Score[]): boolean {
    const smallestScore = highScores.map(iterated=> iterated.score).sort((a, b)=> a-b)[0];
    return score > smallestScore;
  }
}

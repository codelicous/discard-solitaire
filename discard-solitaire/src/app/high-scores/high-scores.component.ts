import { Component, OnInit } from '@angular/core';
import { Score } from './models';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesNames } from '../app.module';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: [ './high-scores.component.scss' ]
})
export class HighScoresComponent implements OnInit {

  public tableData$: Observable<Score[]>
  public displayedColumns = [ 'name',
    'score',
    'recordDate' ];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.tableData$ = this.activatedRoute.data.pipe(
      map( data=> this.sortByScore(data.highScores)));
  }

  public mainMenu() {
    this.router.navigate([ RoutesNames.Home ])
  }

  public sortByScore(scores: Score[]): Score[] {
    return  scores.sort((a,b)=> b.score - a.score);
  }
}

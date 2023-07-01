import { Component, OnInit } from '@angular/core';
import { Score } from './models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.tableData$ = this.activatedRoute.data.pipe(map( data=> data.highScores));
  }
}

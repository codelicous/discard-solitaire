import {Component, OnInit} from '@angular/core';
import {Score} from "./models";
import { FirebaseService } from "../firebase.service";
import {from, Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import _ from 'lodash';
@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.scss']
})
export class HighScoresComponent implements OnInit {

  public tableData$: Observable<Score[]>
  public displayedColumns = ['name', 'score', 'recordDate'] ;
  constructor(private fireBaseService: FirebaseService) {
  }
  ngOnInit(): void {
    this.tableData$ = from(this.fireBaseService.getAllScores()).pipe(map(this.initScores),
      tap(scores=> scores.forEach(score => console.log(_.isDate(score.recordDate)))))
  }


  private initScores(scores: Score[]): any[] {
    return scores;
  }
}

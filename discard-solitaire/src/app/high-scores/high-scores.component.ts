import {Component, OnInit} from '@angular/core';
import {Score} from "./models";
import { FirebaseService } from "../firebase.service";

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.scss']
})
export class HighScoresComponent implements OnInit {
  public scores: Score[];
  constructor(private fireBaseService: FirebaseService) {
  }
  ngOnInit(): void {
    this.initScores()
  }


  private initScores() {

  }
}

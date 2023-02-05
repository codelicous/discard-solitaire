import { Component, OnInit } from '@angular/core';
import { CardType, CardValue, enumToArrayNumericValues } from './models';
import { CardsHelper } from './cards-helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'discard-solitaire';
  helper: CardsHelper = new CardsHelper();
  ngOnInit(): void {
    console.log('king is bigger then queen' , CardValue.King > CardValue.Queen);
    console.log(enumToArrayNumericValues(CardType).map(type => enumToArrayNumericValues(CardValue).map(value => ({ type, value}))).flat());
    console.log(this.helper.getDeck());
  }
}

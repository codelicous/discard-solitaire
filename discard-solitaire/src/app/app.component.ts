import { Component, OnInit } from '@angular/core';
import { Card, CardType, cardValue, enumToArrayNumericValues } from './models';
import { CardsHelper } from './cards-helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'discard-solitaire';
  helper: CardsHelper = new CardsHelper();
  public deck: Card[] = [];
  public firstCardOfDeck: Card | undefined;
  public test: any
  ngOnInit(): void {
    console.log('king is bigger then queen' , cardValue.king > cardValue.queen);
    console.log(enumToArrayNumericValues(CardType).map(type => enumToArrayNumericValues(cardValue).map(value => ({ type, value}))).flat());
    this.deck= this.helper.getDeck();
    this.firstCardOfDeck =  { ...this.deck[0], isShown: true};
    console.log(this.firstCardOfDeck.img)
    this.test =  this.firstCardOfDeck.img;

  }
}

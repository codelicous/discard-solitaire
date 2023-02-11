import { Component } from '@angular/core';
import { Card } from './models';
import { CardsHelper } from './cards-helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'discard-solitaire';
  helper: CardsHelper = new CardsHelper();
  public deck: Card[] = this.helper.getDeck();
  public firstCardOfDeck = { ...this.deck[0], isShown: true};
  public test =  this.firstCardOfDeck.img
}

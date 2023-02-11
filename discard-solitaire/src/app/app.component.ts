import { Component, OnInit } from '@angular/core';
import { Card } from './models';
import { CardsHelper } from './cards-helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'discard-solitaire';
  helper: CardsHelper = new CardsHelper();
  public deck: Card[] = this.helper.getDeck();
  public firstCardOfDeck = { ...this.deck[0], isShown: true};
  public test =  this.firstCardOfDeck.img
  cardStacks: Card[][] = [[], [], [], []];

  public firstCard: any

  ngOnInit(): void {
    this.deck = this.helper.getDeck();
    this.dealFirstToStacks();
    this.dealToStacks();
    this.discard(this.cardStacks[0]);
  }

  private dealFirstToStacks(): void {
    this.cardStacks = this.cardStacks.map(() => {
        return [{ ...this.deck.pop(), isShown: true }];
      }
    )
  };

  private dealToStacks(): void {
    this.cardStacks = this.cardStacks.map(stack => {
        return [this.deck.pop(), ...stack];
      }
    )
  }

  public discard(stack: Card[]): void {
    stack.pop();
  }
}

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
  public firstCardImage;
  public secondCardImage;
  public thirdCardImage;
  public fourthCardImage;
  public firstCard: any

  ngOnInit(): void {
    this.deck = this.helper.getDeck();
    this.dealFirstToStacks();
    this.dealToStacks();
    this.discard(this.cardStacks[0]);
    console.log(this.cardStacks);
  }

  public dealFirstToStacks(): void {
    this.cardStacks = this.cardStacks.map(() => {
        return [{ ...this.deck.pop(), isShown: true }];
      }
    )
  };

  public dealToStacks(): void {
    this.cardStacks = this.cardStacks.map(stack => [this.deck.pop(), ...stack] );
    this.updateTopCardImages();
  }

  public discard(stack: Card[]): void {
    stack.pop();
  }

  private updateTopCardImages() {
    this.firstCardImage = this.cardStacks[0][0]?.img;
    this.secondCardImage = this.cardStacks[1][0]?.img;
    this.thirdCardImage = this.cardStacks[2][0]?.img;
    this.fourthCardImage = this.cardStacks[3][0]?.img;

  }

  getImage(i) {
    switch (i){
      case 0:
        return this.firstCardImage;
      case 1:
        return this.secondCardImage;
      case 2:
        return this.thirdCardImage;
      case 3:
        return this.fourthCardImage;
    }

  }
}

import { Component, OnInit } from '@angular/core';
import { Card } from './models';
import { CardsHelper } from './cards-helper';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

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
  public cardStacks: Card[][] = [[], [], [], []];
  public cardImage0;
  public cardImage1;
  public cardImage2;
  public cardImage3;
  public firstCard: any
  private currentPresentedCards: Card[];
  card: any;
  private movedIndex: number;
  public movedCard: Card;

  ngOnInit(): void {
    this.deck = this.helper.getDeck();
    this.dealToStacks();
  }

  public dealFirstToStacks(): void {
    this.cardStacks = this.cardStacks.map(() => {
        return [{ ...this.deck.pop(), isShown: true }];
      }
    )
  };

  public dealToStacks(): void {
    if (!this.deck.length) {
      return;
    }

    this.cardStacks = this.cardStacks.map(stack => [this.deck.pop(), ...stack] );
    this.updateTopCardImages();
  }

  public discard(stack: Card[]): void {
    stack.pop();
  }

  private updateTopCardImages() {
    this.cardImage0 = this.cardStacks[0][0]?.img;
    this.cardImage1 = this.cardStacks[1][0]?.img;
    this.cardImage2 = this.cardStacks[2][0]?.img;
    this.cardImage3 = this.cardStacks[3][0]?.img;
    this.currentPresentedCards = [this.cardStacks[0][0],
      this.cardStacks[1][0], this.cardStacks[2][0], this.cardStacks[3][0]];


  }

  getImage(i) {
   return this[`cardImage${i}`];
  }

   public getImageOfCardBehind(index): string {
   return   this.cardStacks[index][0]?.img;
  }

  public deckMarginRep(): any[] {
    return this.deck.length >= 3 ? [1,2] : this.deck.length > 1 ?  [1] : [];
  }

  public discardIfCan(i: number) {
    if(this.canDiscard(i)){
      this.cardStacks[i].shift();
      this.updateCardImageAfterDiscard(i);
    }
  }

  private canDiscard(i: number): boolean {
    const currentCard = this.cardStacks[i][0];
    if (!currentCard) {
      return false;
    }
    const otherCards = this.currentPresentedCards.filter(card => card?.img !== currentCard.img);
    return this.hasHigherCardSameType(currentCard, otherCards);
  }

  private hasHigherCardSameType(currentCard: Card, otherCards: Card[]): boolean {
    return otherCards.some(card => card && (card.type == currentCard.type && card.value > currentCard.value));
  }

  private updateCardImageAfterDiscard(i: number) {
      this[`cardImage${i}`] = this.cardStacks[i][0]?.img;
      this.currentPresentedCards[i] = this.cardStacks[i][0];
  }

   public drop($event: CdkDragDrop<any, any>) {
  }

   public shiftCard(i: number) {
     console.log(this.cardStacks[i].map(card => card.img));
     console.log('drag started')
    this.movedIndex = i;
    this.movedCard = this.cardStacks[i].shift();
     console.log(this.cardStacks[i].map(card => card.img));

  }

  logEnded(i: number) {
    this.cardStacks[i].unshift(this.movedCard);
    this.movedCard = null;
  }
}

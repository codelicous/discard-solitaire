import { calcRandomPosition, Card, CardType, CardValue, enumToArrayNumericValues } from './models';


export class CardsHelper {

  private cardDeck: Card[];

  constructor() {
    this.cardDeck = this.generateDeck();
  }

   private generateDeck(): Card[] {
    return enumToArrayNumericValues(CardType).map(type => enumToArrayNumericValues(CardValue).map(value => ({ type, value}))).flat();
  }

  private shuffle(deck: Card[]): Card[] {
    let newDeck = new Array<Card>(52);
    deck.forEach((card, index) => {
        let newPosition = this.getNewPosition(index, newDeck);
        newDeck[newPosition] = card;
    });
    return newDeck;
  }

  private getNewPosition(oldPosition: number, newDeck: Card[]): number {
    let newPosition = calcRandomPosition();

    if((oldPosition === newPosition) || newDeck[newPosition]) {
      return this.getNewPosition(oldPosition, newDeck);
    }
    return newPosition;
  }

  public getDeck(): Card[] {
    return this.shuffle(this.cardDeck);
  }
}

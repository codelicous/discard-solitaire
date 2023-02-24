import {
  calcRandomPosition,
  Card,
  CardType,
  cardValue,
  cardValueToCardName,
  enumToArrayKeys,
  enumToArrayNumericValues
} from './models';


export class CardsHelper {

  private readonly cardDeck: Card[];

  constructor() {
    this.cardDeck = this.generateDeck();
  }

   private generateDeck(): Card[] {
    return enumToArrayNumericValues(CardType).map((type:number) => enumToArrayNumericValues(cardValue).map((value:number) => ({
      type,
      value,
      isShown: false,
      img: CardsHelper.getImgPath(type, value)}))
    ).flat();
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

    if ((oldPosition === newPosition) || newDeck[newPosition]) {
      return this.getNewPosition(oldPosition, newDeck);
    }
    return newPosition;
  }

  public getDeck(): Card[] {
    return this.shuffle(this.cardDeck);
  }

  private static getImgPath(type: any, value: number ): string {
    return `./assets/cards-images/${cardValueToCardName[value]}_${enumToArrayKeys(CardType)[type].toLowerCase()}.png`;
  }
}

import {
  Card,
  CardType,
  cardValue,
  cardValueToCardName,
  enumToArrayKeys,
  enumToArrayNumericValues
} from './models';
import { shuffle } from 'lodash-es';
export class CardsHelper {

  private readonly cardDeck: Card[];

  constructor() {
    this.cardDeck = this.generateDeck();
  }

  private generateDeck(): Card[] {
    return enumToArrayNumericValues(CardType).map((type: number) => enumToArrayNumericValues(cardValue).map((value: number) => ({
      type,
      value,
      isShown: false,
      img: CardsHelper.getImgPath(type, value) }))
    ).flat();
  }

  public getDeck(): Card[] {
    // fisher yates shuffle algorithm
    return shuffle(this.cardDeck);
  }

  private static getImgPath(type: number, value: number ): string {
    return `./assets/cards-images/${cardValueToCardName[value]}_${enumToArrayKeys(CardType)[type].toLowerCase()}.png`;
  }
}

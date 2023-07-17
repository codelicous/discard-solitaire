import {
  Card,
  CardType,
  cardValue,
  cardValueToCardName,
  enumToArrayKeys,
  enumToArrayNumericValues
} from './models';
import { shuffle } from 'lodash-es';
import { PreloadService } from './preload.service';

export class CardsHelper {

  private readonly cardDeck: Card[];

  constructor(private preLoadService: PreloadService) {
    this.cardDeck = this.generateDeck();
    const cardImages = this.cardDeck.map(card => card.img);
    this.preLoadService.preloadImages(cardImages);
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

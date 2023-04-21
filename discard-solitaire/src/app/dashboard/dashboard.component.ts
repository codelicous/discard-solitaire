import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import {CardsHelper} from "../cards-helper";
import { Card,
         cardValue,
         DifficultyType,
         GameState,
         UtilClasses
} from "../models";

import _ from 'lodash';
import {CdkDragDrop, CdkDragExit, CdkDragStart, transferArrayItem} from "@angular/cdk/drag-drop";
import {ConfigurationService} from "../configuration.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChildren('cardStack') cardStackRefs: QueryList<ElementRef>;
  @ViewChildren('cardMargins') cardMarginsRefs: QueryList<ElementRef>;

  @HostListener('document:keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Z' && event.ctrlKey && event.shiftKey) {
      this.reDoState();
      return;
    }

    if (event.key === 'z' && event.ctrlKey === true) {
      this.undoGameState();
    }
  }

  helper: CardsHelper = new CardsHelper();
  public deck: Card[] = this.helper.getDeck();
  public undoNumber = 0;
  public discarded = 0;
  public cardStacks: Card[][] = [[], [], [], []];
  public cardImage0;
  public cardImage1;
  public cardImage2;
  public cardImage3;

  private gameState: GameState = {
    deck: [],
    cardStacks: [],
    moveState: 0
  }
  public movedIndex: number;
  public discardedBeforeDeal = 0;
  public movedCard: Card;

  constructor(private renderer: Renderer2,
              private configurationService: ConfigurationService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.deck = this.helper.getDeck();
    this.dealToStacks(true);
    this.setGameDifficulty();
  }


  public dealToStacks(initialDeal?: boolean): void {
    if (!this.deck.length) {
      return;
    }

    if (this.hasEmptyStack() && !initialDeal) {
      if (this.noCardToFillEmptyStack()) {
        this.fillEmptyStacks();
        this.updateGameState();
        this.discardedBeforeDeal = 0;
        return;
      } else {
        return;
      }
    }

    this.cardStacks = this.cardStacks.map(stack => {
      return this.deck.length && [this.deck.pop(), ...stack] || stack;
    });
    this.updateTopCardImages();
    this.updateGameState();
    this.discardedBeforeDeal = 0;
  }

  public discard(stack: Card[]): void {
    stack.pop();
  }

  private updateTopCardImages() {
    this.cardImage0 = this.cardStacks[0][0]?.img;
    this.cardImage1 = this.cardStacks[1][0]?.img;
    this.cardImage2 = this.cardStacks[2][0]?.img;
    this.cardImage3 = this.cardStacks[3][0]?.img;
  }

  public deckMarginRep(): any[] {
    return this.deck.length >= 3 ? [1, 2] : this.deck.length > 1 ? [1] : [];
  }

  public discardIfCan($event: MouseEvent, i: number) {
    this.renderer.removeClass($event.target, UtilClasses.Marked);
    if (this.canDiscard(i)) {
      this.cardStacks[i].shift();
      this.updateCardImageAfterDiscard(i);
      this.updateGameState();
    }
  }

  private canDiscard(i: number): boolean {
    const currentCard = this.cardStacks[i][0];

    if (!currentCard) {
      return false;
    }

    const otherCards = this.cardStacks.map(stack => stack[0]).filter(card => card?.img !== currentCard.img);
    return !this.isKing(currentCard) &&(
      this.hasHigherCardSameType(currentCard, otherCards) ||
      (this.configurationService.selectedDifficulty < DifficultyType.Hardest && this.cardBehindSameKindHigher(this.cardStacks[i]))
      || (this.configurationService.selectedDifficulty === DifficultyType.Easy && otherCards.some(card => card.value === currentCard.value)));
  }

  private hasHigherCardSameType(currentCard: Card, otherCards: Card[]): boolean {
    return otherCards.some(card => card && (card.type == currentCard.type && card.value > currentCard.value));
  }

  private updateCardImageAfterDiscard(i: number) {
    this[`cardImage${i}`] = this.cardStacks[i][0]?.img;
    this.discarded++;
    this.discardedBeforeDeal++;
  }

  public drop($event: CdkDragDrop<any, any>, i: number) {
    this.movedIndex = null;
    if ($event.previousContainer === $event.container) {
      this.endDrag(i);
      return;
    }
    this.cardStacks[$event.container.data].unshift(this.movedCard);
    this.movedCard = null;
    this.unMarkAllCards();
    transferArrayItem(
      $event.previousContainer.data,
      $event.container.data,
      $event.previousIndex,
      $event.currentIndex,
    );
    this.cardStacks = [...this.cardStacks];
  }


  public cardsLeft(): number {
    return this.cardStacks
      .map(stack => stack.length)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  public shiftCard($event: CdkDragStart, i: number): void {
    this.movedIndex = i;
    const element = $event.event.target as HTMLElement;
    if (!element.classList.contains(UtilClasses.Marked)) {
      this.markElement(element, i);
    }

    this.movedIndex = i;
    this.movedCard = this.cardStacks[i].shift();
    this.changeDetectorRef.markForCheck();
  }

  public endDrag(i: number) {
    this.cardStacks[i].unshift(this.movedCard);
    this.movedCard = null;
    this.unMarkAllCards();
    console.log('post Action');
  }

  public triggerAction($event: MouseEvent, i: number): void {
    if (($event.target as HTMLElement).classList.contains(UtilClasses.Marked)) {
      this.discardIfCan($event, i);
      return;
    }
    this.markElement($event.target as HTMLElement, i)
  }

  public unMarkAllCards(): void {
    [...this.cardStackRefs, ...this.cardMarginsRefs].forEach(ref => this.renderer.removeClass(ref.nativeElement, UtilClasses.Marked));
  }

  private markElement(element: HTMLElement, i: number): void {
    this.unMarkAllCards();
    const cardMargin = this.cardMarginsRefs.filter(ref => ref.nativeElement.classList.contains(`stack-num-${i}`)).pop();

    cardMargin && this.renderer.addClass(cardMargin.nativeElement, UtilClasses.Marked);
    this.renderer.addClass(element, UtilClasses.Marked);
  }

  onHoverExited($event: CdkDragExit<number>, i: number) {
    if (this.movedIndex === i) {
      return
    }
    this.renderer.removeClass($event.container.element.nativeElement?.querySelector('.top-deck'), 'hide');
  }

  private cardBehindSameKindHigher(cardStack: Card[]): boolean {
    const currentCard = cardStack[0];
    const comparedToCard = cardStack[1];
    return currentCard.type === comparedToCard?.type && currentCard.value < comparedToCard?.value;
  }

  private hasEmptyStack(): boolean {
    return this.cardStacks.some(stack => stack.length === 0);
  }

  private fillEmptyStacks(): void {
    this.cardStacks.forEach(stack => {
      stack.length === 0 && this.deck.length && stack.push(this.deck.pop());
    })
  }

  private noCardToFillEmptyStack(): boolean {
    return this.cardStacks.every(stack => stack.length <= 1);
  }

  private updateGameState(): void {
    this.gameState.deck.push(_.cloneDeep(this.deck));
    this.gameState.cardStacks.push(_.cloneDeep(this.cardStacks));
    this.gameState.moveState += 1;
  }

  public undoGameState(): void {
    if (this.undoNumber == 5) {
      return;
    }

    this.deck = this.gameState.deck[this.gameState.moveState - 2];
    this.cardStacks = this.gameState.cardStacks[this.gameState.moveState - 2];
    this.gameState.moveState -= 1;
    this.updateTopCardImages();
    this.changeDetectorRef.detectChanges();
    this.undoNumber += 1;
  }

  public reDoState(): void {
    if (!this.undoNumber) {
      return;
    }
    this.deck = this.gameState.deck[this.gameState.moveState];
    this.cardStacks = this.gameState.cardStacks[this.gameState.moveState];
    this.gameState.moveState += 1;
    this.updateTopCardImages();
    this.changeDetectorRef.detectChanges();
    this.undoNumber -= 1;
  }

  public resetGame(): void {
    this.gameState = {
      deck: [],
      cardStacks: [],
      moveState: 0
    };
    this.discarded = 0;
    this.undoNumber = 0;
    this.cardStacks = [[], [], [], []];
    this.cardImage1 = null;
    this.cardImage0 = null;
    this.cardImage3 = null;
    this.cardImage2 = null;
    this.movedCard = null;
    this.changeDetectorRef.detectChanges();
    this.deck = this.helper.getDeck();
    this.dealToStacks(true);
  }

  private setGameDifficulty(): void {
    switch (this.configurationService.selectedDifficulty) {
      case DifficultyType.Easy: {
        break;
      }
      case DifficultyType.Normal: {
        break;
      }
      case DifficultyType.Hard: {
        break;
      }
      default: {

      }
    }
  }

  private isKing(currentCard: Card): boolean {
    console.log(`isKing: + ${currentCard.value === cardValue.king}`);
    return currentCard.value === cardValue.king;
  }
}

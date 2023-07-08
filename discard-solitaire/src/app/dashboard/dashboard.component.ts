import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import { CardsHelper } from '../cards-helper';
import {
  Card,
  cardValue,
  DifficultyType,
  GameState,
  UtilClasses
} from '../models';

import { cloneDeep } from 'lodash-es';
import {
  CdkDragDrop,
  CdkDragExit,
  CdkDragStart,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { ConfigurationService } from '../configuration.service';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { of, Subject, Subscription } from 'rxjs';
import { DialogDestination } from '../game-won-modal/models';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageUtil } from '../sessionStorageUtil';
import { GameWonModalService } from '../game-won-modal/game-won-modal.service';
import { RoutesNames } from '../app.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChildren('cardStack') cardStackRefs: QueryList<ElementRef>;
  @ViewChildren('cardMargins') cardMarginsRefs: QueryList<ElementRef>;


  @HostListener('window:keydown', [ '$event' ])
  public onKeyPress(event: KeyboardEvent) {
    if (event.key === 'z' && event.ctrlKey === true) {
      this.undoGameState();
    }
  }

  public helper: CardsHelper = new CardsHelper();
  public deck: Card[] = this.helper.getDeck();
  public discarded = 0;
  public cardStacks: Card[][] =
    [
      [],
      [],
      [],
      [] ];
  public cardImage0: string;
  public cardImage1: string;
  public cardImage2: string;
  public cardImage3: string;
  public gameState: GameState = {
    deck: [],
    cardStacks: [],
    moveState: 0,
    discarded: 0,
    undoNumber: 0,
    undoRedoMove: 0,
    discardedBeforeDeal: 0
  }
  private componentDestroyed$ = new Subject();
  private previousGameState: GameState = {
    deck: [],
    cardStacks: [],
    moveState: 0,
    discarded: 0,
    undoNumber: 0,
    undoRedoMove: 0,
    discardedBeforeDeal: 0
  }
  public movedIndex: number;
  public movedCard: Card;

  constructor(public configurationService: ConfigurationService,
              private renderer: Renderer2,
              private router: Router,
              private route: ActivatedRoute,
              private gameWonModalService: GameWonModalService,
              private changeDetectorRef: ChangeDetectorRef) {
  }


  public ngOnInit(): void {
    this.stateLoaderSubscription();
  }


  public dealToStacks(initialDeal?: boolean): void {
    if (!this.deck.length) {
      return;
    }

    if (this.hasEmptyStack() && !initialDeal) {
      if (this.noCardToFillEmptyStack()) {
        this.fillEmptyStacks();
        this.updateGameState();
        this.gameState.discardedBeforeDeal = 0;
        this.checkGameState()
        return;
      } else {
        return;
      }
    }

    this.cardStacks = this.cardStacks.map(stack => this.deck.length &&
      [ this.deck.pop(),
        ...stack ] || stack);
    this.updateTopCardImages();
    this.updateGameState();

    if (initialDeal) {
      this.gameState.discardedBeforeDeal = 999;
      this.gameState.discardedBeforeDeal = 0;
    } else {
      this.gameState.discardedBeforeDeal = 0;
    }

  }

  public discard(stack: Card[]): void {
    stack.pop();
  }

  private stateLoaderSubscription(): Subscription {
    return this.route.queryParams.pipe(
      take(1),
      takeUntil(this.componentDestroyed$),
      tap(this.initGameState.bind(this))).subscribe();
  }

  private initGameState(): void {
    if (this.configurationService.savedGameState && this.configurationService.selectedDifficulty) {
      this.gameState = this.configurationService.savedGameState;
      this.deck = this.gameState.deck;
      this.cardStacks = this.gameState.cardStacks;
      this.calcDiscarded();
    } else {
      this.deck = this.helper.getDeck();
      this.dealToStacks(true);
    }
  }

  private updateTopCardImages() {
    this.cardImage0 = this.cardStacks[0][0]?.img;
    this.cardImage1 = this.cardStacks[1][0]?.img;
    this.cardImage2 = this.cardStacks[2][0]?.img;
    this.cardImage3 = this.cardStacks[3][0]?.img;
  }

  public deckMarginRep(): number[] {
    return this.deck.length >= 3 ? [ 1,
      2 ] : this.deck.length > 1 ? [ 1 ] : [];
  }

  public discardIfCan($event: MouseEvent, i: number) {
    this.renderer.removeClass($event.target, UtilClasses.Marked);
    if (this.canDiscard(i)) {
      this.cardStacks[i].shift();
      this.updateCardImageAfterDiscard(i);
      this.updateGameState();
      this.checkGameState();
    }
  }

  private canDiscard(i: number): boolean {
    const currentCard = this.cardStacks[i][0];

    if (!currentCard) {
      return false;
    }

    const otherCards = this.cardStacks.map(stack => stack[0]).filter(card => card?.img !== currentCard.img);
    return !this.isKing(currentCard) && (
      this.hasHigherCardSameType(currentCard, otherCards) ||
      (this.configurationService.selectedDifficulty < DifficultyType.Hardest && this.cardBehindSameKindHigher(this.cardStacks[i])) ||
      (this.configurationService.selectedDifficulty === DifficultyType.Easy && otherCards.some(card => card?.value === currentCard?.value)));
  }

  private hasHigherCardSameType(currentCard: Card, otherCards: Card[]): boolean {
    return otherCards.some(card => card && (card.type == currentCard.type && card.value > currentCard.value));
  }

  private updateCardImageAfterDiscard(i: number): void {
    this[`cardImage${i}`] = this.cardStacks[i][0]?.img;
    this.calcDiscarded()
    this.gameState.discardedBeforeDeal++;
  }

  public drop($event: CdkDragDrop<any>, i: number): void {
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
      $event.currentIndex
    );
    this.cardStacks = [ ...this.cardStacks ];
    this.checkGameState();
    this.updateGameState();
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
    this.changeDetectorRef.detectChanges();
  }

  public endDrag(i: number): void {
    this.cardStacks[i].unshift(this.movedCard);
    this.movedCard = null;
    this.unMarkAllCards();
  }

  public triggerAction($event: MouseEvent, i: number): void {
    if (($event.target as HTMLElement).classList.contains(UtilClasses.Marked)) {
      this.discardIfCan($event, i);
      return;
    }
    this.markElement($event.target as HTMLElement, i)
  }

  public unMarkAllCards(): void {
    [ ...Array.from(document.querySelectorAll('.top-deck')),
      ...Array.from(document.querySelectorAll('.card-margin')) ].forEach(ref => this.renderer.removeClass(ref, UtilClasses.Marked));
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  private markElement(element: HTMLElement, i: number): void {
    this.unMarkAllCards();
    const cardMargin = this.cardMarginsRefs.filter(ref => ref.nativeElement.classList.contains(`stack-num-${i}`)).pop();

    cardMargin && this.renderer.addClass(cardMargin.nativeElement, UtilClasses.Marked);
    this.renderer.addClass(element, UtilClasses.Marked);
  }

  onHoverExited($event: CdkDragExit<number>, i: number): void {
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
    return this.cardStacks.some(stack => stack.length === 0);
  }

  private updateGameState(): void {
    this.previousGameState.deck = cloneDeep(this.gameState.deck);
    this.gameState.deck = cloneDeep(this.deck);
    this.previousGameState.cardStacks = cloneDeep(this.gameState.cardStacks);
    this.gameState.cardStacks = cloneDeep(this.cardStacks);
    this.previousGameState.moveState = cloneDeep(this.gameState.moveState)
    this.gameState.moveState += 1;
    this.previousGameState.undoNumber = this.gameState.undoNumber;
    this.gameState.undoNumber = 0;

    SessionStorageUtil.saveGameState(this.gameState);
  }

  public undoGameState(): void {
    if (this.gameState.undoNumber !== 0) {
      return;
    }

    this.deck = cloneDeep(this.previousGameState.deck);
    this.cardStacks = cloneDeep(this.previousGameState.cardStacks)

    this.gameState.moveState -= 1;
    this.discarded = this.calcDiscarded();
    this.updateTopCardImages();
    this.changeDetectorRef.detectChanges();
    this.gameState.undoNumber += 1;
    this.gameState.undoRedoMove += 1;
    SessionStorageUtil.saveGameState(this.gameState);
  }

  public resetGame(): void {
    this.gameState = {
      deck: [],
      cardStacks: [],
      moveState: 0,
      discarded: 0,
      undoRedoMove: 0,
      undoNumber: 0,
      discardedBeforeDeal: 999
    };
    this.discarded = 0;
    this.gameState.undoNumber = 0;
    this.cardStacks = [ [],
      [],
      [],
      [] ];
    this.cardImage1 = null;
    this.cardImage0 = null;
    this.cardImage3 = null;
    this.cardImage2 = null;
    this.movedCard = null;

    SessionStorageUtil.reset();
    this.calcDiscarded();

    this.deck = this.helper.getDeck();
    this.dealToStacks(true);
    this.changeDetectorRef.detectChanges();
  }

  private isKing(currentCard: Card): boolean {
    return currentCard.value === cardValue.king;
  }

  private checkGameState(): void {
    if (this.gameWon()) {
      this.openWinnerModal()
      return;
    }
  }

  private gameWon(): boolean {
    return (this.calcDiscarded() === 48) &&
      this.cardStacks.every(stack => (stack.length === 1) &&
        (stack[0].value === cardValue.king));
  }

  public openWinnerModal(): void {
    const score = this.calcScore();
    this.configurationService.isLoading = true;
    this.gameWonModalService.gameWonModalRef(score).pipe(
      take(1),
      takeUntil(this.componentDestroyed$),
      tap(this.navigateFromDialog.bind(this)),
      catchError(err => {
        console.log(err)
        return(of(err));
      })
    ).subscribe();
  }

  private navigateFromDialog(destination: DialogDestination): void {
    switch (destination) {
    case DialogDestination.Home:
      this.resetGame();
      this.router.navigate([ RoutesNames.Home ]);
      SessionStorageUtil.reset();
      break;
    case DialogDestination.NewGame:
      this.resetGame();
      SessionStorageUtil.reset();
      break;
    case DialogDestination.HighScores:
      this.router.navigate([ RoutesNames.HighScores ]);
      break
    }
  }

  public calcDiscarded(): number {
    return 52 - this.cardsLeft() - this.deck.length;
  }

  private calcScore(): number {
    return (640000 - 100 * this.gameState.undoRedoMove) * this.configurationService.selectedDifficulty;
  }
}

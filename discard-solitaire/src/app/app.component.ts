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
import {Card, GameState, UtilClasses} from './models';
import { CardsHelper } from './cards-helper';
import {
         CdkDragDrop,
         CdkDragExit,
         CdkDragStart,
        transferArrayItem
        }
  from '@angular/cdk/drag-drop';
import _ from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChildren('cardStack') cardStackRefs: QueryList<ElementRef>;
  @ViewChildren('cardMargins') cardMarginsRefs: QueryList<ElementRef>;

  @HostListener('document:keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
    if (event.key === 'z' && event.ctrlKey === true) {
      this.undoGameState();
    }
  }
  public title = 'discard-solitaire';
  helper: CardsHelper = new CardsHelper();
  public deck: Card[] = this.helper.getDeck();
  public firstCardOfDeck = { ...this.deck[0], isShown: true};
  public cardStacks: Card[][] = [[], [], [], []];
  public cardImage0;
  public cardImage1;
  public cardImage2;
  public cardImage3;

  public trackByIdentity = (index: number, item: any) => item;
  private gameState: GameState = {
    deck: [],
    cardStacks:[],
    moveState: 0
  }
  public movedIndex: number;
  public movedCard: Card;

  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.deck = this.helper.getDeck();
    this.dealToStacks(true);
  }


  public dealToStacks(initialDeal?: boolean): void {
    if (!this.deck.length) {
      return;
    }

    if (this.hasEmptyStack() && !initialDeal) {
      if (this.noCardToFillEmptyStack()) {
        this.fillEmptyStacks();
        this.updateGameState();
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
    return this.deck.length >= 3 ? [1,2] : this.deck.length > 1 ?  [1] : [];
  }

  public discardIfCan($event: MouseEvent,i: number) {
    this.renderer.removeClass($event.target, UtilClasses.Marked);
    if(this.canDiscard(i)){
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
    return this.hasHigherCardSameType(currentCard, otherCards) ||
      this.cardBehindSameKindHigher(this.cardStacks[i]);
  }

  private hasHigherCardSameType(currentCard: Card, otherCards: Card[]): boolean {
    return otherCards.some(card => card && (card.type == currentCard.type && card.value > currentCard.value));
  }

  private updateCardImageAfterDiscard(i: number) {
      this[`cardImage${i}`] = this.cardStacks[i][0]?.img;
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
    this.cardStacks= [... this.cardStacks];
  }

  public canEnterDropList( i: number): boolean {
    return !this.cardStacks[i].length && (i !== this.movedIndex);
  }

  public shiftCard($event: CdkDragStart, i: number): void {
    this.movedIndex = i;
    const element = $event.event.target as HTMLElement;
    if (!element.classList.contains(UtilClasses.Marked)) {
        this.markElement(element, i);
    }

    this.movedIndex = i;
    this.movedCard = this.cardStacks[i].shift();
  }

  public endDrag(i: number) {
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
    [...this.cardStackRefs, ...this.cardMarginsRefs].forEach(ref => this.renderer.removeClass(ref.nativeElement, UtilClasses.Marked));
  }

  public getConnectedToDropLists(i: number) {
    return this.cardStacks.map((val, index)=>{
      if(index === i) {
        return null;
      }
      return `drop-list_${index}`;
    }).filter(val => !!val);
  }

  private markElement(element: HTMLElement,i: number): void {
    this.unMarkAllCards();
    const cardMargin = this.cardMarginsRefs.filter(ref => ref.nativeElement.classList.contains(`stack-num-${ i }`)).pop();

    cardMargin && this.renderer.addClass(cardMargin.nativeElement,UtilClasses.Marked);
    this.renderer.addClass(element, UtilClasses.Marked);
  }

  onHoverEnter($event , i: number) {
    if(this.movedIndex === i) {
      return
    }

    this.renderer.addClass($event.container.element.nativeElement?.querySelector('.top-deck'), 'hide');
  }

  onHoverExited($event: CdkDragExit<number>, i: number) {
    if(this.movedIndex  === i) {
      return
    }
    this.renderer.removeClass($event.container.element.nativeElement?.querySelector('.top-deck'), 'hide');
  }

  private cardBehindSameKindHigher( cardStack: Card[]): boolean {
    const  currentCard = cardStack[0];
    const comparedToCard = cardStack[1];
    return currentCard.type === comparedToCard.type && currentCard.value < comparedToCard.value;
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
    this.gameState.moveState +=1;
  }

  private undoGameState(): void {
    this.deck = this.gameState.deck[this.gameState.moveState - 2];
    this.cardStacks = this.gameState.cardStacks[this.gameState.moveState -2];
    this.gameState.moveState -=1;
    this.updateTopCardImages();
    this.changeDetectorRef.detectChanges();
  }
}

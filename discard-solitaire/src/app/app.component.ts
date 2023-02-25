import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Card, UtilClasses } from './models';
import { CardsHelper } from './cards-helper';
import { CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChildren('cardStack') cardStackRefs: QueryList<ElementRef>;
  @ViewChildren('cardMargins') cardMarginsRefs: QueryList<ElementRef>;
  public title = 'discard-solitaire';
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
  public trackByIdentity = (index: number, item: any) => item;
  private currentPresentedCards: Card[];
  private movedIndex: number;
  public movedCard: Card;

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {
  }
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

   public getImageOfCardBehind(index): string {
   return   this.cardStacks[index][0]?.img;
  }

  public deckMarginRep(): any[] {
    return this.deck.length >= 3 ? [1,2] : this.deck.length > 1 ?  [1] : [];
  }

  public discardIfCan($event: MouseEvent,i: number) {
    this.renderer.removeClass($event.target, UtilClasses.Marked);
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
    const otherCards = this.cardStacks.map(stack => stack[0]).filter(card => card?.img !== currentCard.img);
    return this.hasHigherCardSameType(currentCard, otherCards);
  }

  private hasHigherCardSameType(currentCard: Card, otherCards: Card[]): boolean {
    return otherCards.some(card => card && (card.type == currentCard.type && card.value > currentCard.value));
  }

  private updateCardImageAfterDiscard(i: number) {
      this[`cardImage${i}`] = this.cardStacks[i][0]?.img;
      this.currentPresentedCards[i] = this.cardStacks[i][0];
  }

  public drop($event: CdkDragDrop<any, any>, i: number) {
    if ($event.previousContainer === $event.container) {
      this.endDrag(i);
      return;
    }
    console.log(this.cardStacks);
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
    this.currentPresentedCards[i] = this.cardStacks[i][0];
  }

  public canEnterDropList( i: number, drag: CdkDrag, drop: CdkDropList): boolean {
    return !this.cardStacks[i].length;
  }

  public shiftCard($event: CdkDragStart, i: number): void {
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
    console.log(element.classList);
  }
}

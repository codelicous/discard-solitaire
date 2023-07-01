import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import { Card, DifficultyType } from "../../models";
import { CdkDragDrop, CdkDragExit, CdkDragStart } from "@angular/cdk/drag-drop";
import { ConfigurationService } from "../../configuration.service";
import {
  ActionEmitterPayload,
  DropEmitterPayload,
  HoverExitedEmitterPayload,
  ShiftCardEventEmitterPayload
} from "./models";

@Component({
  selector: 'app-card-stacks',
  templateUrl: './card-stacks.component.html',
  styleUrls: [ './card-stacks.component.scss' ]
})
export class CardStacksComponent {
  @ViewChildren('cardStack') cardStackRefs: QueryList<ElementRef>;
  @ViewChildren('cardMargins') cardMarginsRefs: QueryList<ElementRef>;

  @Input() cardStacks: Card[][];
  @Input() deck: Card[];
  @Input() movedIndex: number;
  @Input() movedCard: Card;

  @Output() triggerActionEmitter = new EventEmitter<ActionEmitterPayload>();
  @Output() dropEmitter = new EventEmitter<DropEmitterPayload>();
  @Output() shiftCardEmitter= new EventEmitter<ShiftCardEventEmitterPayload>();
  @Output() hoverExited= new EventEmitter<HoverExitedEmitterPayload>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private configurationService: ConfigurationService,
              private renderer: Renderer2) {

  }
  public trackByIdentity:TrackByFunction<Card[]> = (index: number, item: Card[]) => item;

  public onHoverEnter($event, i: number): void {
    if (this.movedIndex === i) {
      return
    }

    this.renderer.addClass($event.container.element.nativeElement?.querySelector('.top-deck'), 'hide');
  }

  public onHoverExited($event: CdkDragExit<number>, i: number): void {
    this.hoverExited.emit({ $event, i })
  }

  public onDrop($event: CdkDragDrop<any>, i: number): void {
    this.dropEmitter.emit({ $event, i });
  }

  public canEnterDropList(i: number): boolean {
    if (this.configurationService.selectedDifficulty <= DifficultyType.Normal) {

      return ((this.movedCard?.value === 1 && this.shownCards().filter(card => card?.value === 1).length === 0) &&
        i !== this.movedIndex) ||  (!this.cardStacks[i].length && (i !== this.movedIndex));
    }

    return !this.cardStacks[i].length && (i !== this.movedIndex);
  }

  public shiftCard($event: CdkDragStart, i: number): void {
    this.shiftCardEmitter.emit({ $event, i })
  }

  public shownCards(): Card[] {
    return  this.cardStacks.map(stack=> stack[0]);
  }

  public triggerAction($event: MouseEvent, i: number): void {
    this.triggerActionEmitter.emit({ $event, i });
  }

  public getConnectedToDropLists(i: number): string[] {
    return this.cardStacks.map((val, index) => {
      if (index === i) {
        return null;
      }
      return `drop-list_${index}`;
    }).filter(Boolean);
  }

  public isCardInStackSelected(i: number, lastMargin): boolean {
    return lastMargin && !!document.querySelector(`.top-deck.marked._${i}`);
  }
}

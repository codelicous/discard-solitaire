import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import {Card, DifficultyType} from "../../models";
import {CdkDragDrop, CdkDragExit, CdkDragStart} from "@angular/cdk/drag-drop";
import {ConfigurationService} from "../../configuration.service";

@Component({
  selector: 'app-card-stacks',
  templateUrl: './card-stacks.component.html',
  styleUrls: ['./card-stacks.component.scss']
})
export class CardStacksComponent {
  @ViewChildren('cardStack') cardStackRefs: QueryList<ElementRef>;
  @ViewChildren('cardMargins') cardMarginsRefs: QueryList<ElementRef>;

  @Input() cardStacks: Card[][];
  @Input() deck: Card[];
  @Input() movedIndex: number;
  @Input() movedCard: Card;

  @Output() onTriggerAction = new EventEmitter<any>();
  @Output() drop = new EventEmitter<any>();
  @Output() onEndDrag= new EventEmitter<any>();
  @Output() onShiftCard= new EventEmitter<any>();
  @Output() hoverExited= new EventEmitter<any>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private configurationService: ConfigurationService,
              private renderer: Renderer2) {

  }
  public trackByIdentity = (index: number, item: any) => item;

  public onHoverEnter($event, i: number) {
    if (this.movedIndex === i) {
      return
    }

    this.renderer.addClass($event.container.element.nativeElement?.querySelector('.top-deck'), 'hide');
  }

  public onHoverExited($event: CdkDragExit<number>, i: number) {
    this.hoverExited.emit({$event, i})
  }

  public onDrop($event: CdkDragDrop<any, any>, i: number) {
    this.drop.emit({$event, i});
  }

  public canEnterDropList(i: number): boolean {
    if (this.configurationService.selectedDifficulty <= DifficultyType.Normal) {
      return (this.movedCard?.value === 1 && this.shownCards().filter(card => card?.value === 1).length === 0) &&
        i !== this.movedIndex ||  (!this.cardStacks[i].length && (i !== this.movedIndex)) ;
    }

    return !this.cardStacks[i].length && (i !== this.movedIndex);
  }

  public shiftCard($event: CdkDragStart, i: number): void {
  this.onShiftCard.emit({$event, i})
  }

  public shownCards(): Card[] {
    return  this.cardStacks.map(stack=> stack[0]);
  }

  public triggerAction($event: MouseEvent, i: number): void {
    this.onTriggerAction.emit({$event, i});
  }

  public getConnectedToDropLists(i: number): string[] {
    return this.cardStacks.map((val, index) => {
      if (index === i) {
        return null;
      }
      return `drop-list_${index}`;
    }).filter(Boolean);
  }



}

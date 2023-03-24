import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, Output,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import { Card } from "../../models";
import { CdkDragDrop, CdkDragExit, CdkDragStart } from "@angular/cdk/drag-drop";

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

  @Output() discardIfCan = new EventEmitter<{event: MouseEvent, index: number}>();
  @Output() onTriggerAction = new EventEmitter<any>();
  @Output() drop = new EventEmitter<any>();
  @Output() onEndDrag= new EventEmitter<any>();
  @Output() onShiftCard= new EventEmitter<any>();
  @Output() hoverExited= new EventEmitter<any>();
  constructor(private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2,) {

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
    return !this.cardStacks[i].length && (i !== this.movedIndex);
  }

  public shiftCard($event: CdkDragStart, i: number): void {
  this.onShiftCard.emit({$event, i})
  }

  public endDrag(i: number) {
    this.onEndDrag.emit(i);
  }

  public triggerAction($event: MouseEvent, i: number): void {
    this.onTriggerAction.emit({$event, i});
  }



  public getConnectedToDropLists(i: number) {
    return this.cardStacks.map((val, index) => {
      if (index === i) {
        return null;
      }
      return `drop-list_${index}`;
    }).filter(Boolean);
  }



}

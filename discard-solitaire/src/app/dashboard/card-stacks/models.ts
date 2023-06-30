import {CdkDragDrop, CdkDragExit, CdkDragStart} from '@angular/cdk/drag-drop';
import {Card} from '../../models';

export interface ActionEmitterPayload {
  $event: MouseEvent,
  i: number
}
export interface DropEmitterPayload {
  $event: CdkDragDrop<number, Card>,
  i: number
}

export interface ShiftCardEventEmitterPayload {
  $event: CdkDragStart,
    i: number
}

export interface HoverExitedEmitterPayload {
  $event: CdkDragExit<number>,
  i: number
}

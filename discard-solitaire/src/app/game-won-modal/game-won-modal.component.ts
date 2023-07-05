import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, DialogDestination } from './models';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-won-modal',
  templateUrl: './game-won-modal.component.html',
  styleUrls: [ './game-won-modal.component.scss' ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})

export class GameWonModalComponent {
  @Input() score = 0;
  readonly destination = DialogDestination;
  scoreIsInTopTen$: any;
  constructor(public dialogRef: MatDialogRef<GameWonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}

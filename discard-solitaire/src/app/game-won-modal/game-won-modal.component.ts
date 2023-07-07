import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, DialogDestination } from './models';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

export class GameWonModalComponent implements OnInit{
  @Input() score = 0;
  readonly destination = DialogDestination;
  public formGroup: FormGroup;
  constructor(public dialogRef: MatDialogRef<GameWonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    if(this.data.topTenEligible) {
      this.initFormData();
    }
  }

  private initFormData() {
    this.formGroup = new FormGroup({
      name: new FormControl( '',
        [ Validators.required,
          Validators.maxLength(100) ]
      )
    })
  }
}

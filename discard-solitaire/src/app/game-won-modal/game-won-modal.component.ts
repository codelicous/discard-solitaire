import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, DialogDestination } from './models';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';

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
  public scoreSent: boolean;
  public isUpdating: boolean;
  constructor(public dialogRef: MatDialogRef<GameWonModalComponent>,
              private firebaseService: FirebaseService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    if(this.data.topTenEligible) {
      this.initFormData();
    }
  }

  public updateScore(): void {
    this.isUpdating = true;
    this.firebaseService.addNewScore( { name: this.formGroup.value.name , score: 0 })
      .then(this.onUpdateScore.bind(this));
  }

  private initFormData() {
    this.formGroup = new FormGroup({
      name: new FormControl( '',
        [ Validators.required,
          Validators.maxLength(100) ]
      )
    })
  }

  private onUpdateScore(): void {
    this.isUpdating = false;
    this.scoreSent = true;
  }
}

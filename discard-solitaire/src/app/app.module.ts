import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardStacksComponent } from './dashboard/card-stacks/card-stacks.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CardStacksComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DragDropModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule, IonicModule, FormsModule
  ],
  exports: [MainComponent]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { FormComponent } from './components/form/form.component';

@NgModule({
  declarations: [MainComponent, FormComponent],
  imports: [
    CommonModule, IonicModule, FormsModule
  ],
  exports: [MainComponent, FormComponent]
})

export class SharedModule { }

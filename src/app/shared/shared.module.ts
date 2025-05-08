import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { FormComponent } from './components/form/form.component';
import { ReportComponent } from './components/report/report.component';

@NgModule({
  declarations: [MainComponent, FormComponent, ReportComponent],
  imports: [
    CommonModule, IonicModule, FormsModule
  ],
  exports: [MainComponent, FormComponent, ReportComponent]
})

export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { FormComponent } from './components/form/form.component';
import { ReportComponent } from './components/report/report.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LettersOnlyDirective } from './directives/input-restriction.directive';
import { NumbersOnlyDirective } from './directives/input-restriction.directive';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  IonicModule
];
const COMPONENTS = [
  MainComponent, 
  FormComponent, 
  ReportComponent,
  ChangePasswordComponent,
];
const DIRECTIVES = [
  LettersOnlyDirective,
  NumbersOnlyDirective,
];
@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  imports: [
    ...MODULES
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
  ]
})

export class SharedModule { }

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
import { SubjectComponent } from './components/subject/subject.component';

@NgModule({
  declarations: [
    MainComponent, 
    FormComponent, 
    ReportComponent,
    ChangePasswordComponent,
    LettersOnlyDirective,
    NumbersOnlyDirective,
    SubjectComponent
  ],
  imports: [
    CommonModule, IonicModule, FormsModule,ReactiveFormsModule
  ],
  exports: [
    MainComponent, 
    FormComponent, 
    ReportComponent,
    ReactiveFormsModule,
    ChangePasswordComponent,
    LettersOnlyDirective,
    NumbersOnlyDirective,
    SubjectComponent
  ]
})

export class SharedModule { }

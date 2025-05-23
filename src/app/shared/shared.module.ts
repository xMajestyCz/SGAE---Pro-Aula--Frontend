import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes
import { MainComponent } from './components/main/main.component';
import { FormComponent } from './components/form/form.component';
import { ReportComponent } from './components/report/report.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';


// Directivas
import { LettersOnlyDirective } from './directives/input-restriction.directive';
import { NumbersOnlyDirective } from './directives/input-restriction.directive';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { EnrollmentformComponent } from './components/enrollment/enrollmentform/enrollmentform.component';
import { EnrollmentSearchComponent } from './components/enrollment/enrollment-search/enrollment-search.component';
import { EnrollmentEditComponent } from './components/enrollment/enrollment-edit-form/enrollment-edit-form.component';


@NgModule({
  declarations: [
    MainComponent, 
    FormComponent, 
    ReportComponent, 
    ChangePasswordComponent, 
    LettersOnlyDirective, 
    NumbersOnlyDirective,
    EnrollmentComponent,
    EnrollmentformComponent,
    EnrollmentSearchComponent,
    EnrollmentEditComponent
  
  ],
  imports: [
    CommonModule, 
    IonicModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [],
  exports: [
    MainComponent, 
    FormComponent, 
    ReportComponent, 
    ReactiveFormsModule, 
    ChangePasswordComponent, 
    LettersOnlyDirective, 
    NumbersOnlyDirective,
    EnrollmentComponent,
    EnrollmentComponent,
    EnrollmentComponent,
    EnrollmentformComponent,
    EnrollmentSearchComponent

  ]
})
export class SharedModule { }
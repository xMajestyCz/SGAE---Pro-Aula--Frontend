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
import { RegisterTabComponent } from './components/users-form/register-tab/register-tab.component';
import { UserFormComponent } from './components/users-form/user-form/user-form.component';
import { ListTabComponent } from './components/users-form/list-tab/list-tab.component';
import { EditTabComponent } from './components/users-form/edit-tab/edit-tab.component';
import { CreateScheduleModalComponent } from './components/create-schedule-modal/create-schedule-modal.component';
import { CreateSchedulePanelComponent } from './components/schedule/create-schedule-panel/create-schedule-panel.component';

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
  RegisterTabComponent,
  UserFormComponent,
  ListTabComponent,
  EditTabComponent,
  CreateScheduleModalComponent,
  CreateSchedulePanelComponent
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

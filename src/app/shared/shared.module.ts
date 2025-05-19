import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { FormComponent } from './components/form/form.component';
import { ReportComponent } from './components/report/report.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AddressService } from './services/address.service';
import { c } from '@angular/core/navigation_types.d-u4EOrrdZ';

const MODULES = [
  CommonModule,
  IonicModule,
  FormsModule,
  ReactiveFormsModule
];

const COMPONENTS = [
  MainComponent,
  FormComponent,
  ReportComponent,
  ChangePasswordComponent
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    ...MODULES
  ],
  exports: [...MODULES, ...COMPONENTS],
  providers: [AddressService],
})

export class SharedModule { }

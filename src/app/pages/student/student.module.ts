import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { StudentPageRoutingModule } from './student-routing.module';

import { StudentPage } from './student.page';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    StudentPageRoutingModule
  ],
  declarations: [StudentPage]
})
export class StudentPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSchedulePageRoutingModule } from './create-schedule-routing.module';

import { CreateSchedulePage } from './create-schedule.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CreateSchedulePageRoutingModule
  ],
  declarations: [CreateSchedulePage]
})
export class CreateSchedulePageModule {}

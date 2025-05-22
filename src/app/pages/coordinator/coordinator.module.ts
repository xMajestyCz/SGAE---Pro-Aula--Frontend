import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { CoordinatorPageRoutingModule } from './coordinator-routing.module';

import { CoordinatorPage } from './coordinator.page';

@NgModule({
  imports: [
    CoordinatorPageRoutingModule,
    SharedModule
  ],
  declarations: [CoordinatorPage]
})
export class CoordinatorPageModule {}

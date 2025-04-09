import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { SecretaryPageRoutingModule } from './secretary-routing.module';

import { SecretaryPage } from './secretary.page';
import { share } from 'rxjs';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SecretaryPageRoutingModule
  ],
  declarations: [SecretaryPage]
})
export class SecretaryPageModule {}

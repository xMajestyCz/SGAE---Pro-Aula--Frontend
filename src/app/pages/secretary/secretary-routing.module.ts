import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecretaryPage } from './secretary.page';

const routes: Routes = [
  {
    path: '',
    component: SecretaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecretaryPageRoutingModule {}

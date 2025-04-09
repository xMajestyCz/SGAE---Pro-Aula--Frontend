import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { LogComponent } from './components/log/log.component';
import { LogUserComponent } from './components/log-user/log-user.component';


@NgModule({
  declarations: [MainComponent, LogComponent, LogUserComponent],
  imports: [
    CommonModule, IonicModule, FormsModule
  ],
  exports: [MainComponent]
})
export class SharedModule { }

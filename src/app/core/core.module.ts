import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { LoggerService } from './Services/logger.service';
import { ToastService } from './Services/toast.service';



@NgModule({
  declarations: [],
  providers: [AuthService, LoggerService, ToastService],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }

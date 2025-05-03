import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { SpinnerService } from './Services/spinner.service';
import { LoggerService } from './Services/logger.service';
import { ToastService } from './Services/toast.service';



@NgModule({
  declarations: [],
  providers: [AuthService, SpinnerService, LoggerService, ToastService],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }

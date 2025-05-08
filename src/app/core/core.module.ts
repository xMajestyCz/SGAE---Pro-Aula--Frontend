import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { LoggerService } from './Services/logger.service';



@NgModule({
  declarations: [],
  providers: [AuthService, LoggerService],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }

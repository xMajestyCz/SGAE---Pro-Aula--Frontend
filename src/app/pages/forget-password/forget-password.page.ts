import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
  standalone:false
})
export class ForgetPasswordPage {

  constructor() { }
  email:string='';

  onSubmit(){
    if(this.email){

      console.log('correo enviado',this.email)

    }
  }
}

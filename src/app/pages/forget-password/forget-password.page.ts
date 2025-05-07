import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
  standalone:false
})
export class ForgetPasswordPage {
  forgetPasswordForm!: FormGroup;

  constructor() {
    this.forgetPasswordForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      oldPassword: new FormControl('', [Validators.required]),
      newpassword: new FormControl('',[Validators.required])
    });
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      console.log('Correo enviado:', this.forgetPasswordForm.value.email);
    }
  }

}

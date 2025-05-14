import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: false
})
export class ChangePasswordComponent  {
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required], // Coincide con el HTML
      password: ['', Validators.required]
    });
  }

  onlogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/Services/auth.service';
import { LoggerService } from 'src/app/core/Services/logger.service';
import { SpinnerService } from 'src/app/core/Services/spinner.service';
import { ToastService } from 'src/app/core/Services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private spinnerService: SpinnerService,
    private loggerService: LoggerService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastService.error('Por favor, completa todos los campos.');
      return;
    }
  
    this.isLoading = true;
    this.spinnerService.show();
  
    this.authService.login(this.loginForm.value).subscribe({
      next: response => {
        // Guardar token de acceso
        localStorage.setItem('authToken', response.access);
        
        // this.navCtrl.navigateRoot('/admin');
        
        this.toastService.success('Inicio de sesión exitoso.');
        this.loggerService.logInfo('Usuario autenticado con éxito.');
      },
      error: error => {
        this.isLoading = false;
        this.spinnerService.hide();
        
        if (error.status === 400) {
          this.loginForm.controls['password'].setErrors({ incorrect: true });
          this.toastService.error('Usuario o contraseña incorrectos.');
          this.loggerService.logWarning('Intento de inicio de sesión fallido.');
        } else {
          this.toastService.error('Error de conexión con el servidor.');
        }
      },
      complete: () => {
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
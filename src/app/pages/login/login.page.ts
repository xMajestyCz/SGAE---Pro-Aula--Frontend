import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  backendUrl = "https://jesus-castro10-sgae-pro-aula-backend.onrender.com/api/auth/login/"

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private fb: FormBuilder

  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    
    });
  }

  login() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.http.post(this.backendUrl, loginData).subscribe({
        next: (response: any) => {
          const accessToken = response.access;
          localStorage.setItem('authToken', accessToken); 
          //rutas a las paginas de la app aca
          console.log('Proceso de inicio de sesión completado.');
        },
        error: (error) => {
          console.error('Error de inicio de sesión:', error);
          let errorMessage = 'Error al iniciar sesión';

          if (error.status === 400) {
            errorMessage = 'fallo en el incio de sesion. Por favor, verifica tu usuario y contraseña.';
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar al servidor. Por favor, intenta de nuevo más tarde.';
          }

          this.mostrarAlerta('Error de inicio de sesión', errorMessage);
        },
        complete: () => {
          console.log('Proceso de inicio de sesión completado.');
          console.log('Token almacenado en localStorage:', localStorage.getItem('authToken'));
        }
      });
    } else {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
    }
  }
  


  mostrarAlerta(titulo: string, mensaje: string) {
    const alert = document.createElement('ion-alert');
    alert.header = titulo;
    alert.message = mensaje;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    return alert.present();
  }
}





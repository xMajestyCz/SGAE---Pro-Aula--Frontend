import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/core/Services/auth.service';
import { UserService } from 'src/app/core/Services/user.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: false
})
export class AccountComponent  implements OnInit {

  isLoaded = false;
  isLoadingLogout = false; 
  userImage: string | null = null;

  constructor(
    private modalService: ModalService, 
    private alertService: AlertService, 
    private authService: AuthService,
    private loadingCtrl: LoadingController, 
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
  ) { }

  ngOnInit() {}

   async openModal(){
      await this.modalService.open( {
        title: 'Cambiar Contraseña'
      }, 'change-password-modal');
    }
  
    async confirmLogout() {
      const confirm = await this.alertService.showConfirm(
        'Cerrar sesión',
        '¿Estás seguro que deseas salir de la aplicación?',
        'Cancelar',
        'Cerrar sesión'
      );
  
      if (confirm) {
        await this.performLogout();
      }
    }
  
    private async performLogout() {
      const loading = await this.loadingCtrl.create({
        message: 'Cerrando sesión...',
        spinner: 'crescent',
        backdropDismiss: false
      });
  
      try {
        this.isLoadingLogout = true;
        await loading.present();
        
        this.authService.logout();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.router.navigate(['/login']);
        
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      } finally {
        this.isLoadingLogout = false;
        await loading.dismiss();
      }
    }
  
    async loadUserImage() {
      const token = this.authService.currentToken;
      if (token) {
        try {
          const decodedToken = jwtDecode<any>(token);
          const userId = decodedToken.user_id; 
          const role = localStorage.getItem('UserRole');
          
          if (userId && role) {
            this.userImage = await this.userService.getUserImage(userId, role);
          }
        } catch (error) {
          console.error('Error cargando imagen:', error);
        }
      }
    }

}

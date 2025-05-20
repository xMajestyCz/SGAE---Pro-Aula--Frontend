import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/core/Services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {
  selectedRole: string = '';
  loadingRole = false;
  isLoggingOut = false;
  showForm: boolean = false;
  roleNames: {[key: string]: string} = {
    'acudiente': 'Acudiente',
    'coordinador': 'Coordinador',
    'estudiante': 'Estudiante',
    'profesor': 'Profesor',
    'rector': 'Rector',
    'secretaria': 'Secretaria'
  };

  constructor(private menuCtrl: MenuController, private alertService: AlertService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    this.resetRoleState();
  }

  private resetRoleState() {
    this.selectedRole = '';
    this.loadingRole = false;
    this.showForm = false;
  }

  async selectRole(role: string) {
    this.loadingRole = true;
    this.selectedRole = role;
    this.showForm = false;
    await this.menuCtrl.close();

    setTimeout(() => {
    this.loadingRole = false;
    this.showForm = true;
  }, 1000);
  }

  getRoleTitle(): string {
    return this.selectedRole ? this.roleNames[this.selectedRole] : 'Bienvenido';
  }

  async confirmLogout() {
    const confirm = await this.alertService.showConfirm(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir del panel de administración?',
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
      this.isLoggingOut = true;
      await loading.present();
      
      this.authService.logout();
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 500);
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      this.isLoggingOut = false;
      await loading.dismiss();
    }
  }
}

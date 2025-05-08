import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from 'src/app/core/Services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router'; 
import { ReportComponent } from '../report/report.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: false
})
export class MainComponent implements OnInit {
  @Input() ionLabel1 = '';
  @Input() ionLabel2 = '';
  @Input() ionLabel3 = '';
  @Input() ionCardTitle1 = '';
  @Input() ionCardTitle2 = '';
  @Input() ionCardTitle3 = '';
  isLoaded = false;
  isLoadingLogout = false; 

  constructor(
    private modalService: ModalService, 
    private alertService: AlertService, 
    private authService: AuthService,
    private loadingCtrl: LoadingController, 
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.isLoaded = true;
  }

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

  async openReportModal() {
    const modal = await this.modalService.open(
      ReportComponent,
      {},
      'report-modal'
    );
    
    modal.onDidDismiss().then((result: any) => {
      if (result.data?.success) {
        this.toastService.show(
          'Tu problema ha sido reportado exitosamente',
          'success',
          3000,
          'top'
        );
      }
    });
  }
}
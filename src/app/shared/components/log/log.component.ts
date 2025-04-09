import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { LogUserComponent } from '../log-user/log-user.component';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  standalone: false
})
export class LogComponent  implements OnInit {
  showHeader: boolean = false;
  @Input() isInModal: boolean = false;
  proceso: string = '';
  rol: string = '';
  titulo: string = '';
  @ViewChild(LogUserComponent) logUserComponent!: LogUserComponent;

  constructor(private modalCtrl: ModalController, private alertController: AlertController) { }

  ngOnInit() {}
  
  async cancel() {
    if (this.formularioTieneDatos()) {
      this.mostrarAlertaCancelar();
    } else {
      await this.modalCtrl.dismiss(null, 'cancel');
    }
  }
  

  async ionViewDidEnter() {
    const topModal = await this.modalCtrl.getTop();
    this.showHeader = !!topModal;
  }

  onSelectChange() {
    if (this.proceso && this.rol) {
      this.titulo = `${this.proceso} ${this.rol}`;
    } else {
      this.titulo = '';
    }
  }

  formularioTieneDatos(): boolean {
    if (!this.logUserComponent) return false;
    const campos = Object.values(this.logUserComponent.datosEstudiante || {});
    return campos.some(valor => valor !== null && valor !== undefined && valor !== '');
  }
  
  async mostrarAlertaCancelar() {
    const alert = await this.alertController.create({
      header: '¿Deseas cancelar?',
      message: 'Perderás los datos ingresados si sales ahora.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Sí, cancelar',
          handler: () => {
            this.modalCtrl.dismiss(null, 'cancel');
          }
        }
      ]
    });
  
    await alert.present();
  }
}

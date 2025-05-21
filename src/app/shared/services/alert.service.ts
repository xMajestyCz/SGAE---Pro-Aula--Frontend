import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl: AlertController, private navCtrl: NavController) {}

  async showConfirm(header: string, message: string, cancelText: string, confirmText: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false)
          },
          {
            text: confirmText,
            handler: () => resolve(true)
          }
        ]
      });

      await alert.present();
    });
  }
  
  async showAccessDeniedAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Acceso denegado',
      message: 'No tienes permisos para acceder a esta página.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.back(); // Regresa a la página anterior
          }
        }
      ]
    });

    await alert.present();
  }
}

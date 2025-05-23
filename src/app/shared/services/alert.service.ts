// src/app/shared/services/alert.service.ts
import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular'; // NavController añadido

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertCtrl: AlertController, // Renombrado a alertCtrl para coincidir con tu código
    private navCtrl: NavController // NavController inyectado
  ) {}

  // Método para mostrar un mensaje de alerta simple (re-añadido para utilidad general)
  async showAlert(header: string, message: string, buttons: string[] = ['OK']) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons
    });
    await alert.present();
  }

  // Método para mostrar una confirmación con dos botones
  async showConfirm(
    header: string,
    message: string,
    cancelText: string, // Sin valor por defecto, como en tu código
    confirmText: string // Sin valor por defecto, como en tu código
  ): Promise<boolean> {
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

  // Método específico para confirmación de eliminación (re-añadido, ya que se usa en EnrollmentComponent)
  async showDeleteConfirmation(itemId: number): Promise<boolean> {
    return this.showConfirm(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar el elemento con ID ${itemId}?`,
      'Cancelar', // Valores explícitos para showConfirm
      'Eliminar'  // Valores explícitos para showConfirm
    );
  }

  // Método para mostrar alerta de acceso denegado y regresar a la página anterior
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

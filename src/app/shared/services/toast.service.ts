import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) {}

  async show(message: string, color: string = 'primary', duration: number = 2000, position: 'top' | 'middle' | 'bottom' = 'top') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }


  async showToast(message: string, color: 'success' | 'warning' | 'danger' = 'success', duration = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  success(message: string) {
    this.showToast(message, 'success');
  }

  error(message: string) {
    this.showToast(message, 'danger');
  }

  warning(message: string) {
    this.showToast(message, 'warning');
  }
}

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
}

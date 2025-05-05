import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalCtrl: ModalController) {}

  async open(component: any, props: any = {}, cssClass: string = '') {
    const modal = await this.modalCtrl.create({
      component,
      componentProps: props,
      cssClass
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    return result;
  }

  async dismiss(data: any = null, role: string = '') {
    return this.modalCtrl.dismiss(data, role);
  }

  async getTop() {
    return this.modalCtrl.getTop();
  }
}

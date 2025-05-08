import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalCtrl: ModalController) {}

  async open(component: any, props: any = {}, cssClass: string = ''): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component,
      componentProps: props,
      cssClass
    });
    await modal.present();
    return modal;
  }

  async dismiss(data: any = null, role: string = '') {
    return this.modalCtrl.dismiss(data, role);
  }

  async getTop() {
    return this.modalCtrl.getTop();
  }
}

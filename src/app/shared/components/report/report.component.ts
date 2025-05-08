import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  standalone: false
})
export class ReportComponent {
  reportData = {
    title: '',
    description: ''
  };

  constructor(private modalCtrl: ModalController) {}

  submitReport() {
    console.log('Reporte enviado:', this.reportData);
    this.dismissModal(true);
  }

  dismissModal(success = false) {
    this.modalCtrl.dismiss({
      success,
      data: this.reportData
    });
  }
}
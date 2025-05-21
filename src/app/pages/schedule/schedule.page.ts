import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/core/Services/api.service';
import { CreateScheduleModalComponent } from 'src/app/shared/components/create-schedule-modal/create-schedule-modal.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: false
})
export class SchedulePage {

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  times = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'];

  schedule = [
    { day: 'Lunes', time: '08:00', subject: 'Matemáticas', room: 'Aula 101', group: 'A1' },
    { day: 'Martes', time: '09:00', subject: 'Historia', room: 'Aula 202', group: 'B1' },
    { day: 'Miércoles', time: '10:00', subject: 'Física', room: 'Laboratorio', group: 'C1' }
  ];

  constructor(private modalCtrl: ModalController, private apiSrv: ApiService) {}

  getClassForSlot(day: string, time: string) {
    return this.schedule.find(c => c.day === day && c.time === time);
  }

  async openCreateScheduleModal() {
    const modal = await this.modalCtrl.create({
      component: CreateScheduleModalComponent,
      breakpoints: [0, 0.8],
      initialBreakpoint: 0.8,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.saved) {
      this.schedule.push(data.schedule);
    }
  }
}

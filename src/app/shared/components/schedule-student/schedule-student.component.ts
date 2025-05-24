import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-schedule-student',
  templateUrl: './schedule-student.component.html',
  styleUrls: ['./schedule-student.component.scss'],
  standalone: false
})
export class ScheduleStudentComponent  implements OnInit {
  
  constructor(private modalService:ModalService) { }


  ngOnInit() {
  }
  async openModal() {
  const existingModal = await this.modalService.getTop();
  if (!existingModal){
    console.log('Abriendo modal...');
    await this.modalService.open(ScheduleStudentComponent, {}, 'modal-shedule-student');
  }
}
async closeModal() {
  console.log('Cerrando modal...');
  await this.modalService.dismiss();

}

}

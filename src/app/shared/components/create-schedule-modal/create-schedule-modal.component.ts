import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/core/Services/api.service';

@Component({
  selector: 'app-create-schedule-modal',
  templateUrl: './create-schedule-modal.component.html',
  styleUrls: ['./create-schedule-modal.component.scss'],
  standalone: false
})
export class CreateScheduleModalComponent implements OnInit {

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  subjects !: any[];
  groups = ['A1', 'B1', 'C1'];
  classrooms !: any[];

  form = {
    day: '',
    startTime: '',
    endTime: '',
    subject: '',
    classroom: '',
    group: ''
  };

  constructor(private modalCtrl: ModalController,
    private apiSrv: ApiService
  ) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit(): void {
    this.loadSubjects();
    this.loadClassromms();
  }
  save() {
    console.log('Form data:', this.form);
    this.modalCtrl.dismiss({
      saved: true,
      schedule: this.form
    });
  }

  loadSubjects(){
    this.apiSrv.get('subjects/').subscribe({
      next: (response) => {
        console.log('Subjects:', response);
        this.subjects = response;
      }
    });
  }

  loadClassromms(){
    this.apiSrv.get('classrooms/').subscribe({
      next: (response) => {
        console.log('Classrooms:', response);
        this.classrooms = response;
      }
    });
  }
  
}

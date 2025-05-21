import { Component } from '@angular/core';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.page.html',
  styleUrls: ['./create-schedule.page.scss'],
  standalone: false
})
export class CreateSchedulePage {

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  subjects = ['Matemáticas', 'Historia', 'Ciencias', 'Inglés', 'Física'];
  groups = ['A1', 'A2', 'B1', 'B2'];

  form = {
    day: '',
    startTime: '',
    endTime: '',
    subject: '',
    room: '',
    group: ''
  };

  saveSchedule() {
    console.log('Clase guardada:', this.form);
    // Aquí podrías enviar a tu backend o Firestore
  }
}

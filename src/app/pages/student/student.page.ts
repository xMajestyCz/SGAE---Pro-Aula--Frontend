import { Component, OnInit, Type } from '@angular/core';
import { AcademyResultComponent } from 'src/app/shared/components/academy-result/academy-result.component';
import { ScheduleStudentComponent } from 'src/app/shared/components/schedule-student/schedule-student.component';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
  standalone: false
})
export class StudentPage implements OnInit {

  constructor(private modalservice:ModalService) { }

  ngOnInit() {
  }

}

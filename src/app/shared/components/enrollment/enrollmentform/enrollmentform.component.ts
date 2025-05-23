import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { Enrollment } from 'src/app/shared/models/enrollment';
import { Group } from 'src/app/shared/models/group';
import { StudentInfo } from 'src/app/shared/models/student-info';
import { IonItem, IonLabel, IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: 'app-enrollmentform',
  templateUrl: './enrollmentform.component.html',
  styleUrls: ['./enrollmentform.component.scss'],
  standalone:false
})
export class EnrollmentformComponent  implements OnInit {
@Input() students!: Observable<StudentInfo[]>;
  @Input() groups!: Observable<Group[]>;
  @Input() isDataLoading!: boolean;
  @Input() isSubmitting!: boolean;
  @Input() enrollmentSuccess!: boolean;

  @Output() formSubmit = new EventEmitter<Enrollment>();

  enrollmentForm!: FormGroup;
  availableGroups!: Observable<Group[]>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.enrollmentForm = this.fb.group({
      studentId: ['', Validators.required],
      groupId: ['', Validators.required],
      enrollment_date: [this.getTodayDate(), Validators.required],
      status: ['active', Validators.required],
      academic_year: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      observations: ['']
    });

    this.availableGroups = combineLatest([
      this.groups,
      this.students,
      this.enrollmentForm.get('studentId')!.valueChanges.pipe(
        startWith(this.enrollmentForm.get('studentId')?.value),
        debounceTime(200),
        distinctUntilChanged()
      )
    ]).pipe(
      // map(([allGroups, allStudents, selectedStudentId]) => {
      //   const selectedStudent = allStudents.find(s => s.id === selectedStudentId);
      //   if (!selectedStudent || !selectedStudent.program_id) {
      //     return allGroups;
      //   }
      //   return allGroups.filter(group => group.program_id === selectedStudent.program_id);
      // })
    );
  }

  getTodayDate(): string {
    return new Date().toISOString().substring(0, 10);
  }

  onSubmit() {
    if (this.enrollmentForm.valid) {
      this.enrollmentForm.markAllAsTouched();
      this.formSubmit.emit(this.enrollmentForm.value);
    } else {
      this.enrollmentForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.enrollmentForm.reset();
    this.enrollmentForm.patchValue({
      enrollment_date: this.getTodayDate(),
      status: 'active',
      academic_year: new Date().getFullYear()
    });
  }

}

// src/app/features/enrollment/components/enrollment-edit/enrollment-edit.component.ts
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa ReactiveFormsModule
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

import { Enrollment } from 'src/app/shared/models/enrollment'; // Ajusta la ruta
import { StudentInfo } from 'src/app/shared/models/student-info'; // Ajusta la ruta
import { Group } from 'src/app/shared/models/group'; // Ajusta la ruta
import { Observable, combineLatest } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-enrollment-edit-form-component',
  templateUrl: './enrollment-edit-form.component.html',
  styleUrls: ['./enrollment-edit-form.component.scss'],
  standalone:false

})
export class EnrollmentEditComponent implements OnInit, OnChanges {
  @Input() enrollmentToUpdate: Enrollment | null = null;
  @Input() isLoadingForUpdate!: boolean;
  @Input() isUpdating!: boolean;
  @Input() isDeleting!: boolean;
  @Input() searchAttempted!: boolean;
  @Input() students!: Observable<StudentInfo[]>;
  @Input() groups!: Observable<Group[]>;
  @Input() isDataLoading!: boolean;

  @Output() loadEnrollment = new EventEmitter<number>();
  @Output() updateEnrollment = new EventEmitter<Enrollment>();
  @Output() deleteEnrollment = new EventEmitter<number>();
  @Output() confirmDelete = new EventEmitter<void>();

  searchForm!: FormGroup;
  editForm!: FormGroup;
  availableGroups!: Observable<Group[]>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],
      studentId: ['', Validators.required],
      groupId: ['', Validators.required],
      enrollment_date: ['', Validators.required],
      status: ['', Validators.required],
      academic_year: ['', [Validators.required, Validators.min(2000)]],
      observations: ['']
    });

    this.availableGroups = combineLatest([
      this.groups,
      this.students,
      this.editForm.get('studentId')!.valueChanges.pipe(
        startWith(this.editForm.get('studentId')?.value),
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enrollmentToUpdate'] && changes['enrollmentToUpdate'].currentValue) {
      const enrollment: Enrollment = changes['enrollmentToUpdate'].currentValue;
      // Parchear valores asegurándose de que enrollment_date sea un string válido para input type="date"
      this.editForm.patchValue({
        id: enrollment.id,
        // studentId: enrollment.studentId,
        // groupId: enrollment.groupId,
        enrollment_date: enrollment.enrollment_date ? enrollment.enrollment_date.substring(0, 10) : '',
        status: enrollment.status,
        academic_year: enrollment.academic_year,
        observations: enrollment.observations
      });
    }
  }

  onLoadForEdit() {
    if (this.searchForm.valid) {
      this.loadEnrollment.emit(Number(this.searchForm.value.query));
    } else {
      this.searchForm.markAllAsTouched();
    }
  }

  onUpdateEnrollment() {
    if (this.editForm.valid && this.enrollmentToUpdate?.id !== undefined) {
      this.updateEnrollment.emit({ ...this.editForm.value, id: this.enrollmentToUpdate.id });
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  onConfirmDelete() {
    this.confirmDelete.emit();
  }

  resetForms(): void {
    this.searchForm.reset();
    this.editForm.reset();
  }
}





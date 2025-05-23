// src/app/features/enrollment/components/enrollment-search/enrollment-search.component.ts
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa ReactiveFormsModule
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

import { Enrollment } from 'src/app/shared/models/enrollment'; // Ajusta la ruta
import { StudentInfo } from 'src/app/shared/models/student-info'; // Ajusta la ruta
import { Group } from 'src/app/shared/models/group'; // Ajusta la ruta

@Component({
  selector: 'app-enrollment-search',
  templateUrl: './enrollment-search.component.html',
  styleUrls: ['./enrollment-search.component.scss'],
  standalone: false,

})
export class EnrollmentSearchComponent implements OnInit {
  @Input() foundEnrollment: Enrollment | null = null;
  @Input() isSearching!: boolean;
  @Input() searchAttempted!: boolean;
  @Input() studentsCache!: { [id: number]: StudentInfo };
  @Input() groupsCache!: { [id: number]: Group };

  @Output() search = new EventEmitter<string>();

  searchForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.search.emit(this.searchForm.value.query);
    } else {
      this.searchForm.markAllAsTouched();
    }
  }

  getStudentName(studentId: number): string {
    const student = this.studentsCache[studentId];
    return student ? `${student.first_name} ${student.first_lastname}` : `ID: ${studentId} (Desconocido)`;
  }

  getGroupName(groupId: number): string {
    const group = this.groupsCache[groupId];
    return group ? group.name : `ID: ${groupId} (Desconocido)`;
  }

  resetForm(): void {
    this.searchForm.reset();
  }
}
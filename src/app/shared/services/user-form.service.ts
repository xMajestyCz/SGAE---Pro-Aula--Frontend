import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../models/student';
import { UserData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserFormService {
  constructor(private fb: FormBuilder) {}

  createForm(role: string): FormGroup {
    const isStudent = role === 'estudiante';

    return this.fb.group({
      first_name: ['', [Validators.required]],
      second_name: [''],
      first_lastname: ['', [Validators.required]],
      second_lastname: ['', [Validators.required]],
      id_card: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      birthdate: ['', [Validators.required]],
      place_of_birth: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      image: [null],
      guardian: [isStudent ? null : undefined]
    });
  }

  getUserDataFromForm(form: FormGroup, role: string): UserData | Student {
    const value = form.value;
    if (role === 'estudiante') {
      return {
        ...value,
        guardian: value.guardian
      } as Student;
    }
    return value as UserData;
  }
}

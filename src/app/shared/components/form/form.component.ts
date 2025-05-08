import { Component, Input, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/core/Services/api.service';
import { ToastService } from '../../services/toast.service';
import { UserData } from 'src/app/models/user.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent {
  @Input() title: string = '';
  @Input() selectedRole: string = '';
  previousRole: string = ''; 
  isLoading = false;
  maxBirthDate: Date;
  minBirthDate: Date;
  
  datosUsuario: UserData = {
    first_name: '',
    second_name: '',
    first_lastname: '',
    second_lastname: '',
    id_card: '',
    birthdate: '',
    place_of_birth: '',
    address: '',
    phone: '',
    email: '',
    photo: null
  };

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
  ) {
    const currentDate = new Date();
    this.maxBirthDate = new Date(
      currentDate.getFullYear() - 2,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    
    this.minBirthDate = new Date(
      currentDate.getFullYear() - 70,
      currentDate.getMonth(),
      currentDate.getDate()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRole'] && !changes['selectedRole'].firstChange) {
      const previousRole = changes['selectedRole'].previousValue;
      const currentRole = changes['selectedRole'].currentValue;
      
      if (previousRole !== currentRole) {
        this.resetFormData();
      }
    }
  }

  resetFormData(): void {
    this.datosUsuario = {
      first_name: '',
      second_name: '',
      first_lastname: '',
      second_lastname: '',
      id_card: '',
      birthdate: '',
      place_of_birth: '',
      address: '',
      phone: '',
      email: '',
      photo: null
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.datosUsuario.photo = input.files[0];
    }
  }
  
  async save(form: NgForm): Promise<void> {
    this.isLoading = true;
    
    try {
      const endpoint = this.getEndpointByRole();
      const data = this.prepareJsonData();

      const response = await this.apiService.post(endpoint, data, false).toPromise();
      
      this.toastService.show('Estudiante registrado exitosamente', 'success');
      form.resetForm();
      this.resetFormData();
      
    } catch (error: any) {
      this.handleApiError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleApiError(error: any): void {
    console.error('Error completo:', error);
    
    if (error.status === 409) {
      this.handleDuplicateError(error.serverError || error);
    } else if (error.message) {
      console.log('error: '+error.message);
    } else {
      this.toastService.show('Error desconocido al registrar', 'danger');
    }
  }

  private handleDuplicateError(errorData: any): void {
    let errorMessage = 'Datos duplicados: ';
    
    if (Array.isArray(errorData?.non_field_errors)) {
      errorMessage += errorData.non_field_errors.join(', ');
    } else if (errorData?.id_card) {
      errorMessage += `El documento ${errorData.id_card} ya existe`;
    } else if (errorData?.email) {
      errorMessage += `El email ${errorData.email} ya existe`;
    } else if (errorData?.detail) {
      errorMessage += errorData.detail;
    } else {
      errorMessage += 'El documento o email ya están registrados';
    }
    
    this.toastService.show(errorMessage, 'danger');
  }

  private prepareJsonData(): Omit<UserData, 'photo'> {
    return {
      first_name: this.datosUsuario.first_name,
      second_name: this.datosUsuario.second_name,
      first_lastname: this.datosUsuario.first_lastname,
      second_lastname: this.datosUsuario.second_lastname,
      id_card: this.datosUsuario.id_card,
      birthdate: this.datosUsuario.birthdate,
      place_of_birth: this.datosUsuario.place_of_birth,
      address: this.datosUsuario.address,
      phone: this.datosUsuario.phone,
      email: this.datosUsuario.email
    };
  }

  private getEndpointByRole(): string {
    const roleEndpoints: Record<string, string> = {
      'rector': 'directors/',
      'profesor': 'teachers/',
      'estudiante': 'students/',
      'acudiente': 'guardians/',
      'coordinador': 'academics_coordinators/',
      'secretaria': 'secretaries/'
    };
    
    return roleEndpoints[this.selectedRole] || 'users/';
  }

  onlyLetters(event: KeyboardEvent) {
    const pattern = /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  onlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
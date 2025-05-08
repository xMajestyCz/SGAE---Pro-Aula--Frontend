import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/core/Services/api.service';
import { ToastService } from '../../services/toast.service';
import { UserData } from '../../models/user.model';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent {
  @Input() title: string = '';
  @Input() selectedRole: string = '';
  isLoading = false;
  
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
    private apiService: ApiService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.datosUsuario.photo = input.files[0];
    }
  }

  async save(form: NgForm): Promise<void> {
    if (form.invalid) {
      this.toastService.show('Por favor complete todos los campos requeridos', 'danger');
      return;
    }
  
    this.isLoading = true;
  
    try {
      const endpoint = this.getEndpointByRole();
      const useFormData = this.selectedRole !== 'secretaria';
      const data = useFormData ? this.prepareFormData() : this.prepareJsonData();
  
      await this.apiService.post(endpoint, data, useFormData).toPromise();
      
      this.toastService.show('Registro exitoso', 'success');
      form.resetForm();
      this.datosUsuario.photo = null;
    } catch (error: any) {
      if (error.message.includes('unique constraint')) {
        this.handleDuplicateError(error);
      } else {
        this.toastService.show(error.message || 'Error al registrar', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }
  
  private handleDuplicateError(error: any): void {
    let errorMessage = 'Error al registrar';
    
    if (error.error?.detail?.includes('id_card')) {
      errorMessage = 'El número de documento ya está registrado';
    } else if (error.error?.detail?.includes('email')) {
      errorMessage = 'El correo electrónico ya está registrado';
    } else {
      errorMessage = 'El registro ya existe en el sistema';
    }
    
    this.toastService.show(errorMessage, 'danger');
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const jsonData = this.prepareJsonData();

    Object.entries(jsonData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'photo' && this.datosUsuario.photo instanceof File) {
          formData.append(key, this.datosUsuario.photo);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return formData;
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
}
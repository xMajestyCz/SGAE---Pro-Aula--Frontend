import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserData } from '../../models/user.model';
import { ApiService } from 'src/app/core/Services/api.service';
import { ToastService } from '../../services/toast.service';
import { SupabaseService } from 'src/app/core/Services/supabase.service';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Student } from '../../models/student';
import { Guardian } from '../../models/guardian';

@Component({
  selector: 'app-field-form',
  templateUrl: './field-form.component.html',
  styleUrls: ['./field-form.component.scss'],
  standalone: false
})
export class FieldFormComponent implements OnInit {
  @Output() userCreated = new EventEmitter<UserData>();
  @Input() selectedRole: string = '';
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() userToEdit: UserData | null = null; 

  formData: UserData | Student = {
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
    image: null
  };

  maxBirthDateStudent: Date = new Date();
  minBirthDateStudent: Date = new Date();
  maxBirthDateOtherRoles: Date = new Date();
  minBirthDateOtherRoles: Date = new Date();
  isLoading = false;
  selectedImage: string | ArrayBuffer | null = null;
  selectedGuardianId: string | null = null;
  guardians: Guardian[] = [];
  fileChanged = false;

  constructor(
    private apiService: ApiService,
    private supabaseService: SupabaseService,
    private toastService: ToastService
  ) {
    this.calculateDateLimits();
  }

  ngOnInit() {
    if (this.selectedRole === 'estudiante') {
      this.loadGuardians();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userToEdit'] && this.mode === 'edit') {
      this.initializeFormData();
    }
  }

  private initializeFormData() {
    if (this.userToEdit && this.mode === 'edit') {
      
      this.formData = {
        ...this.userToEdit,
        id: this.userToEdit.id,
        first_name: this.userToEdit.first_name || '',
        second_name: this.userToEdit.second_name || '',
        first_lastname: this.userToEdit.first_lastname || '',
        second_lastname: this.userToEdit.second_lastname || '',
        id_card: this.userToEdit.id_card || '',
        birthdate: this.userToEdit.birthdate || '',
        place_of_birth: this.userToEdit.place_of_birth || '',
        address: this.userToEdit.address || '',
        phone: this.userToEdit.phone || '',
        email: this.userToEdit.email || '',
        image: this.userToEdit.image || null
      };

      if (this.selectedRole === 'estudiante') {
        this.selectedGuardianId = (this.userToEdit as Student).guardian || null;
      }
    }
  }

  private calculateDateLimits() {
    const currentDate = new Date();
    
    this.maxBirthDateStudent = new Date(
      currentDate.getFullYear() - 2,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    
    this.minBirthDateStudent = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    this.minBirthDateOtherRoles = new Date(
      currentDate.getFullYear() - 80,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    
    this.maxBirthDateOtherRoles = new Date(
      currentDate.getFullYear() - 20,
      currentDate.getMonth(),
      currentDate.getDate()
    );
  }

  async submitForm(form: NgForm): Promise<void> {
    if (form.invalid) return;

    this.isLoading = true;
    
    try {
      if (this.mode === 'create') {
        await this.saveUser(form);
      } else {
        await this.updateUser(form);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = `Error al ${this.mode === 'create' ? 'registrar' : 'actualizar'} el usuario`;
      this.toastService.show(errorMessage, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  private async saveUser(form: NgForm): Promise<void> {
    let imageUrl = null;
    let fileName = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput?.files?.[0]) {
      imageUrl = await this.supabaseService.uploadImage(
        environment.supabaseBucket,
        this.selectedRole,
        fileInput.files[0]
      );
      fileName = fileInput.files[0].name;
      console.log('Nombre del archivo subido:', fileName);
    }

    const userData = this.prepareUserData(imageUrl, fileName);
    const endpoint = this.apiService.getEndpointByRole();

    let newUser: UserData;
    
    if (this.selectedRole === 'estudiante') {
      newUser = await this.apiService.post(endpoint, userData as Student).toPromise();
    } else {
      newUser = await this.apiService.post(endpoint, userData).toPromise();
    }

    this.showSuccessMessage('registrado');
    this.resetForm(form);
    
    this.userCreated.emit(newUser);
  }

  private async updateUser(form: NgForm): Promise<void> {
    this.isLoading = true;
    let imageUrl = this.formData.image; 

    try {
      if (this.fileChanged) {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        
        if (fileInput?.files?.[0]) {
          imageUrl = await this.supabaseService.uploadImage(
            environment.supabaseBucket,
            this.selectedRole,
            fileInput.files[0]
          );
          console.log('Nueva imagen subida:', imageUrl);
        } 
        else if (this.selectedImage === null) {
          imageUrl = null;
          console.log('Imagen eliminada');
        }
      }

      // const updateData = this.prepareUserData(imageUrl);
      // const endpoint = this.apiService.getEndpointByRole();

      // const response = await this.apiService.put(
      //   `${endpoint}${this.formData.id}`, 
      //   updateData
      // ).toPromise();

      // console.log('Respuesta del servidor:', response);
      this.showSuccessMessage('actualizado');
      
      if (this.fileChanged) {
        this.formData.image = imageUrl;
        this.selectedImage = imageUrl;
        this.fileChanged = false;
      }

    } catch (error: any) {
      console.error('Error al actualizar:', error);
      const errorMessage = error?.message || 'Error al actualizar el usuario';
      this.toastService.show(errorMessage, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  private prepareUserData(imageUrl: string | null, fileName: string | null): UserData | Student {
    const baseData = {
      ...this.formData,
      image: imageUrl,
      image_file_name: fileName,
      address: this.formData.address,
      phone: this.formData.phone,
      email: this.formData.email
    };

    if (this.selectedRole === 'estudiante') {
      return {
        ...baseData,
        guardian: this.selectedGuardianId || ''
      } as Student;
    }

    return baseData;
  }

  private showSuccessMessage(action: string): void {
    const capitalizedRole = this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1);
    this.toastService.show(`${capitalizedRole} ${action} exitosamente`, 'success');
  }

  private resetForm(form: NgForm): void {
    form.resetForm();
    this.formData = {
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
      image: null
    };
    this.selectedImage = null;
    this.selectedGuardianId = null;
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileChanged = true;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = reader.result;
        this.formData.image = reader.result as string; 
        console.log('Nueva imagen seleccionada:', this.selectedImage);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No se seleccionó archivo o se canceló');
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.selectedImage || this.formData.image) {
      this.fileChanged = true;
    }
    
    this.selectedImage = null;
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    // if (this.mode === 'edit') {
    //   this.formData.image = null; 
    // }
  }

  async loadGuardians(): Promise<void> {
    if (this.selectedRole !== 'estudiante') return;
    
    try {
      const response = await this.apiService.get('guardians/').toPromise();
      this.guardians = Array.isArray(response) ? response : response?.results || [];
    } catch (error) {
      this.toastService.show('Error al cargar acudientes', 'danger');
    }
  }
}
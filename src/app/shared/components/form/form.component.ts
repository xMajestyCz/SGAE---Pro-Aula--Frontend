import { Component, Input, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/core/Services/api.service';
import { ToastService } from '../../services/toast.service';
import { UserData } from '../../models/user.model';
import { SupabaseService } from 'src/app/core/Services/supabase.service';
import { environment } from 'src/environments/environment';
import { Guardian } from '../../models/guardian';
import { Student } from '../../models/student';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent {
  // Input properties
  @Input() title: string = '';
  @Input() selectedRole: string = '';

  // State properties
  isLoading = false;
  isSearching = false;
  isLoadingUsers = false;
  hasMoreUsers = true;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  searchResults: UserData | null = null;
  usersByRole: UserData[] = [];
  selectedImage: string | ArrayBuffer | null = null;
  guardians: Guardian[] = [];
  selectedGuardianId: string | null = null;
  maxBirthDateStudent?: Date;
  minBirthDateStudent?: Date;
  maxBirthDateOtherRoles?: Date;
  minBirthDateOtherRoles?: Date;
  datosUsuario: UserData = this.createEmptyUserData();

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private supabaseService: SupabaseService
  ) {
    const currentDate = new Date();
    this.initializeDateRanges(currentDate);
  }

  ngOnInit() {
    if (this.selectedRole) {
      setTimeout(() => {
        this.loadUsersByRole();
        if (this.selectedRole === 'estudiante') {
          this.loadGuardians();
        }
      }, 500);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRole'] && !changes['selectedRole'].firstChange) {
      this.handleRoleChange(changes['selectedRole'].previousValue, changes['selectedRole'].currentValue);
    }
  }

  resetFormData(): void {
    this.datosUsuario = this.createEmptyUserData();
  }

  async save(form: NgForm): Promise<void> {
    this.isLoading = true;
    
    try {
      const imageUrl = await this.handleImageUpload();
      const baseUserData = this.prepareBaseUserData(imageUrl);

      if (this.selectedRole === 'estudiante') {
        await this.saveStudent(baseUserData, form);
      } else {
        await this.saveOtherRole(baseUserData, form);
      }
    } catch (error: any) {
      this.handleApiError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async searchUserByIdCard(): Promise<void> {
    if (!this.validateSearchInput()) return;

    this.isSearching = true;
    this.searchResults = null;
    
    try {
      await this.performUserSearch();
    } catch (error: any) {
      this.handleSearchError(error);
    } finally {
      this.isSearching = false;
    }
  }

  async loadUsersByRole(): Promise<void> {
    if (!this.selectedRole) {
      return;
    }
    
    this.isLoadingUsers = true;
    this.usersByRole = [];
    this.currentPage = 1;
    this.hasMoreUsers = true;

    try {
      const users = await this.fetchUsersByRole();
      this.usersByRole = users;
    } catch (error: any) {
      this.handleUsersLoadError(error);
    }
  }

  async loadMoreUsers(event: any): Promise<void> {
    if (!this.hasMoreUsers) {
      event.target.complete();
      return;
    }

    this.currentPage++;
    
    try {
      const response = await this.apiService.get(
        `${this.getEndpointByRole()}?page=${this.currentPage}&page_size=${this.pageSize}`
      ).toPromise();
      
      this.usersByRole = [...this.usersByRole, ...(response.results || response)];
      this.hasMoreUsers = !!response.next;
    } catch (error) {
      this.toastService.show('Error al cargar más usuarios', 'danger');
    } finally {
      event.target.complete();
    }
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => this.selectedImage = reader.result;
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.selectedImage = null;
    const fileInput = document.querySelector('.upload-area input[type="file"]') as HTMLInputElement;
    fileInput && (fileInput.value = '');
  }

  private initializeDateRanges(currentDate: Date): void {
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

  private createEmptyUserData(): UserData {
    return {
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
  }

  private handleRoleChange(previousRole: string, currentRole: string): void {
    if (previousRole !== currentRole) {
      this.resetFormData();
      this.loadUsersByRole();
      
      if (currentRole === 'estudiante') {
        this.loadGuardians();
      } else {
        this.selectedGuardianId = null;
      }
    }
  }

  private async handleImageUpload(): Promise<string | null> {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (!fileInput.files?.[0]) return null;

    return await this.supabaseService.uploadImage(
      environment.supabaseBucket,
      this.selectedRole,
      fileInput.files[0]
    );
  }

  private prepareBaseUserData(imageUrl: string | null): UserData {
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
      email: this.datosUsuario.email,
      image: imageUrl
    };
  }

  private async saveStudent(baseUserData: UserData, form: NgForm): Promise<void> {
    const studentData: Student = {
      ...baseUserData,
      guardian: this.selectedGuardianId?.toString() || ''
    };

    const endpoint = this.getEndpointByRole();
    const response = await this.apiService.post(endpoint, studentData).toPromise();
    
    this.showSuccessMessage('estudiante');
    this.resetForm(form);
  }

  private async saveOtherRole(userData: UserData, form: NgForm): Promise<void> {
    const endpoint = this.getEndpointByRole();
    await this.apiService.post(endpoint, userData).toPromise();
    
    this.showSuccessMessage(this.selectedRole);
    this.resetForm(form);
  }

  private showSuccessMessage(role: string): void {
    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
    this.toastService.show(`${capitalizedRole} registrado exitosamente`, 'success');
  }

  private resetForm(form: NgForm): void {
    form.resetForm();
    this.resetFormData();
    this.selectedImage = null;
    if (this.selectedRole === 'estudiante') {
      this.selectedGuardianId = null;
    }
  }

  private validateSearchInput(): boolean {
    if (!this.searchTerm.trim()) {
      this.toastService.show('Ingrese un número de documento', 'warning');
      this.searchResults = null;
      return false;
    }

    if (!/^\d{7,10}$/.test(this.searchTerm)) {
      this.toastService.show('El documento debe tener 10 dígitos numéricos', 'warning');
      this.searchResults = null;
      return false;
    }

    return true;
  }

  private async performUserSearch(): Promise<void> {
    const endpoint = this.getEndpointByRole();
    const allUsers = await this.apiService.get(endpoint).toPromise();
    
    const usersArray = this.normalizeApiResponse(allUsers);
    const foundUser = usersArray.find((user: any) => user.id_card?.toString() === this.searchTerm.trim());
    
    if (foundUser) {
      this.searchResults = foundUser;
      this.fillFormWithSearchResults();
    } else {
      this.toastService.show('No se encontraron resultados', 'warning');
    }
  }
  //actualizar
  private fillFormWithSearchResults(): void {
    if (!this.searchResults) return;

    this.datosUsuario = {
      first_name: this.searchResults.first_name || '',
      second_name: this.searchResults.second_name || '',
      first_lastname: this.searchResults.first_lastname || '',
      second_lastname: this.searchResults.second_lastname || '',
      id_card: this.searchResults.id_card || '',
      birthdate: this.searchResults.birthdate || '',
      place_of_birth: this.searchResults.place_of_birth || '',
      address: this.searchResults.address || '',
      phone: this.searchResults.phone || '',
      email: this.searchResults.email || '',
      image: this.searchResults.image || null
    };

    if (this.searchResults.image) {
      this.selectedImage = this.searchResults.image;
    }
  }

  private handleSearchError(error: any): void {
    console.error('Error en la búsqueda:', error);
    this.searchResults = null;
    
    const errorMessage = error.status === 404 
      ? 'Usuario no encontrado' 
      : 'Error al buscar usuario';
      
    this.toastService.show(errorMessage, error.status === 404 ? 'warning' : 'danger');
  }

  private async fetchUsersByRole(): Promise<any[]> {
    const endpoint = this.getEndpointByRole();
    const timestamp = new Date().getTime();
    const url = `${endpoint}?page=${this.currentPage}&page_size=${this.pageSize}&_=${timestamp}`;
    
    const response = await this.apiService.get(url).toPromise();
    return this.normalizeApiResponse(response);
  }

  private normalizeApiResponse(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (response?.results) {
      this.hasMoreUsers = !!response.next;
      return response.results;
    }
    if (response?.data) {
      this.hasMoreUsers = !!response.next_page;
      return response.data;
    }
    
    console.warn('Formato de respuesta no reconocido, usando array vacío');
    return [];
  }

  private handleUsersLoadError(error: any): void {
    console.error('Error al cargar usuarios:', error);
    this.usersByRole = [];
    
    if (error.status != 404) {
      this.toastService.show('Error al cargar usuarios. Intente nuevamente.', 'danger', 3000);
    }
  }

  private handleApiError(error: any): void {
    console.error('Error completo:', error);
    
    if (error.status === 409) {
      this.handleDuplicateError(error.serverError || error);
    } else if (error.message) {
      console.log('error: ' + error.message);
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

  async loadGuardians(): Promise<void> {
    try {
      const response = await this.apiService.get('guardians/').toPromise();
      this.guardians = this.normalizeApiResponse(response);
    } catch (error) {
      this.toastService.show('Error al cargar la lista de acudientes', 'danger');
    }
  }
}
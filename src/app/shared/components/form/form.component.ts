import { Component, Input, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/core/Services/api.service';
import { ToastService } from '../../services/toast.service';
import { UserData } from '../../models/user.model';
import { SupabaseService } from 'src/app/core/Services/supabase.service';
import { environment } from 'src/environments/environment';
import { Guardian } from '../../models/guardian';
import { Student } from '../../models/student';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent {
  @Input() title: string = '';
  @Input() selectedRole: string = '';
  tabState: {[role: string]: string} = {};
  headers = ['Nombre', 'Documento', 'Teléfono', 'Email', 'Eliminar'];
  isLoading = false;
  maxBirthDateStudent: Date;
  minBirthDateStudent: Date;
  maxBirthDateOtherRoles: Date;
  minBirthDateOtherRoles: Date;
  searchTerm = ''; 
  isSearching = false;
  searchResults: UserData | null = null;
  usersByRole: UserData[] = [];
  isLoadingUsers = false;
  currentPage = 1;
  pageSize = 10;
  hasMoreUsers = true;
  selectedImage: string | ArrayBuffer | null = null;
  guardians: Guardian[] = [];
  selectedGuardianId: string | null = null;
  private searchDebounceTimer: any;
  editUser: any = {}; 
  isUpdating = false;
  editSelectedImage: string | ArrayBuffer | null = null;
  editFileChanged = false;
  
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
    image: null
  };

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private supabaseService: SupabaseService,
    private alertService: AlertService
  ) {
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

  ngOnInit() {
    if (this.selectedRole) {
      this.initializeRoleState(this.selectedRole);
      this.apiService.setSelectedRole(this.selectedRole);
      setTimeout(() => {
        this.loadUsersByRole();
        if (this.selectedRole === 'estudiante') {
          this.loadGuardians();
        }
      }, 500);
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
      image: null
    };
  }

  async save(form: NgForm): Promise<void> {
    this.isLoading = true;
    
    try {
      let imageUrl = null;
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        imageUrl = await this.supabaseService.uploadImage(
          environment.supabaseBucket,
          this.selectedRole,
          file
        );
      }

      const baseUserData: UserData = {
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

      if (this.selectedRole === 'estudiante') {
        const studentData: Student = {
          ...baseUserData,
          guardian: this.selectedGuardianId || ''
        };
        await this.saveStudent(studentData, form);
      } else {
        await this.saveOtherRole(baseUserData, form);
      }
      await this.loadUsersByRole();
      
    } catch (error: any) {
      console.error('Error en save:', error);
      this.handleApiError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async saveStudent(studentData: Student, form: NgForm): Promise<void> {
      const endpoint = this.apiService.getEndpointByRole();
      const response = await this.apiService.post(endpoint, studentData).toPromise();
      
      console.log('Respuesta del backend:', response);
      this.showSuccessMessage();
      this.resetForm(form);
  }

  private async saveOtherRole(userData: UserData, form: NgForm): Promise<void> {
      const endpoint = this.apiService.getEndpointByRole();
      const response = await this.apiService.post(endpoint, userData).toPromise();
      
      console.log('Respuesta del backend:', response);
      this.showSuccessMessage();
      this.resetForm(form);
  }

  private showSuccessMessage(): void {
      const capitalizedRole = this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1);
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

  private handleApiError(error: any): void {
    console.error('Error completo:', error);
    
    if (error.message) {
      this.toastService.show(error.message, 'danger');
    } else {
      this.toastService.show('Error desconocido al registrar', 'danger');
    }
  }

  async searchUserByIdCard(): Promise<void> {
    if (!this.searchTerm?.trim()) {
      this.searchResults = null;
      this.loadUsersByRole();
      return;
    }

    this.isSearching = true;
    
    try {
      const cleanSearchTerm = this.searchTerm.trim();
      const foundUser = this.usersByRole.find(user => 
        user.id_card?.toString().startsWith(cleanSearchTerm)
      );

      this.searchResults = foundUser || null;

    } catch (error) {
      console.error('Error en búsqueda:', error);
      this.toastService.show('Error al buscar', 'danger', 2000);
    } finally {
      this.isSearching = false;
    }
  }

  handleSearchInput(term: string): void {
    this.searchTerm = term;
    
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    
    if (term.trim()) {
      this.isSearching = true;
    }
    
    this.searchDebounceTimer = setTimeout(() => {
      if (!term.trim()) {
        this.searchResults = null;
        this.loadUsersByRole();
      } else {
        this.searchUserByIdCard();
      }
    }, 400);
  }

  handleClearSearch(): void {
    this.searchTerm = '';
    this.searchResults = null;
    this.isLoadingUsers = true;
    this.loadUsersByRole();
  }

  trackByUserId(index: number, user: UserData): string {
    return user.id_card;
  }

  async loadUsersByRole(): Promise<void> {
    this.isLoadingUsers = true;
    
    try {
      const endpoint = this.apiService.getEndpointByRole();
      const response = await this.apiService.get(endpoint).toPromise();
      
      this.usersByRole = Array.isArray(response) ? response : response?.results || [];
      
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.toastService.show('Error al cargar usuarios', 'danger', 2000);
    } finally {
      this.isLoadingUsers = false;
    }
  }

  async loadMoreUsers(event: any): Promise<void> {
    if (!this.hasMoreUsers) {
      event.target.complete();
      return;
    }

    this.currentPage++;
    
    try {
      const endpoint = this.apiService.getEndpointByRole();
      const response = await this.apiService.get(`${endpoint}?page=${this.currentPage}&page_size=${this.pageSize}`).toPromise();
      
      this.usersByRole = [...this.usersByRole, ...(response.results || response)];
      this.hasMoreUsers = response.next ? true : false;
      
    } catch (error) {
      this.toastService.show('Error al cargar más usuarios', 'danger');
    } finally {
      event.target.complete();
    }
  }

  showUserReadyToast(user: UserData) {
    this.toastService.show(
      this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1) + ' listo para modificar', 
      'new8', 
      2000, 
      'top'
    );
    this.loadUserForEdit(user);
  }

  loadUserForEdit(user: UserData) {
    this.editUser = {...user};
    this.editSelectedImage = null;
    this.editFileChanged = false;
    this.selectedTab = 'third';
  }

  async updateUser(form: NgForm): Promise<void> {
    if (form.valid) {
      this.isUpdating = true;
      
      try {
        let imageUrl = this.editUser.image;
        
        if (this.editFileChanged) {
          const fileInput = document.querySelector('#third input[type="file"]') as HTMLInputElement;
          
          if (this.editSelectedImage && fileInput.files && fileInput.files[0]) {
            imageUrl = await this.supabaseService.uploadImage(
              environment.supabaseBucket,
              this.selectedRole,
              fileInput.files[0]
            );
          } else if (!this.editSelectedImage) {
            imageUrl = null;
          }
        }

        const updateData = {
          ...this.editUser, 
          address: this.editUser.address,
          phone: this.editUser.phone,
          email: this.editUser.email,
          image: imageUrl
        };

        const endpoint = this.apiService.getEndpointByRole();
        
        if (!this.editUser.id) {
          throw new Error('ID de usuario no disponible para actualización');
        }

        const response = await this.apiService.put(
          `${endpoint}${this.editUser.id}/`, 
          updateData
        ).toPromise();

        const capitalizedRole = this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1);
        this.toastService.show(`${capitalizedRole} actualizado exitosamente`, 'success');
        
        await this.loadUsersByRole();
        this.selectedTab = 'first';

      } catch (error: any) {
        console.error('Error al actualizar usuario:', error);
        const errorMessage = error?.message || 'Error al actualizar el usuario';
        this.toastService.show(errorMessage, 'danger');
      } finally {
        this.isUpdating = false;
      }
    }
  }

  async deleteUser(user: UserData): Promise<void> {
    const confirm = await this.showDeleteConfirmation();
    if (!confirm) return;

    this.isLoading = true;
    
    try {
      const endpoint = this.apiService.getEndpointByRole();
      
      if (!user.id) {
        throw new Error('ID de usuario no disponible');
      }
      
      await this.apiService.delete(endpoint, user.id).toPromise();
      
      this.toastService.show('Usuario eliminado correctamente', 'success');
      await this.loadUsersByRole();
      this.searchResults = null;
      
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      const errorMessage = error?.message || 'Error al eliminar el usuario';
      this.toastService.show(errorMessage, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  private async showDeleteConfirmation(): Promise<boolean> {
    return this.alertService.showConfirm(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      'Cancelar',
      'Eliminar'
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRole'] && !changes['selectedRole'].firstChange) {
      const previousRole = changes['selectedRole'].previousValue;
      const currentRole = changes['selectedRole'].currentValue;

      if (previousRole !== currentRole) {
        this.apiService.setSelectedRole(currentRole);
        this.handleRoleChange(currentRole);
        this.resetFormData();
        this.loadUsersByRole();
        if (currentRole === 'estudiante') {
          this.loadGuardians();
        } else {
          this.selectedGuardianId = null; 
        }
      }
    }
  }

  private initializeRoleState(role: string): void {
    if (!this.tabState[role]) {
      this.tabState[role] = 'first';
    }
  }

  get selectedTab(): string {
    return this.tabState[this.selectedRole] || 'first';
  }

  set selectedTab(value: string) {
    this.tabState[this.selectedRole] = value;
  }

  private async handleRoleChange(newRole: string): Promise<void> {
    this.isLoadingUsers = true;
    
    try {
      this.initializeRoleState(newRole);
      
      this.apiService.setSelectedRole(newRole);
      this.resetFormData();
      
      await this.loadUsersByRole();
      
      if (newRole === 'estudiante') {
        await this.loadGuardians();
      } else {
        this.selectedGuardianId = null;
      }
    } catch (error) {
      console.error('Error al cambiar de rol:', error);
      this.toastService.show('Error al cargar datos del nuevo rol', 'danger');
    } finally {
      this.isLoadingUsers = false;
    }
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  handleEditFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.editFileChanged = true;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editSelectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeEditImage(event: Event): void {
    event.stopPropagation();
    this.editSelectedImage = null;
    this.editFileChanged = true;
    
    const fileInput = document.querySelector('#third input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.selectedImage = null;

    const fileInput = document.querySelector('.upload-area input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async loadGuardians(): Promise<void> {
    try {
      const response = await this.apiService.get('guardians/').toPromise();
      
      this.guardians = Array.isArray(response) ? response : 
                      response?.results ? response.results : 
                      response?.data ? response.data : [];
    } catch (error) {
      this.toastService.show('Error al cargar la lista de acudientes', 'danger');
    }
  }
}
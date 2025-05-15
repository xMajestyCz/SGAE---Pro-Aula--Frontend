import { Component, Input, SimpleChanges } from '@angular/core';
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
  previousRole: string = ''; 
  isLoading = false;
  maxBirthDate: Date;
  minBirthDate: Date;
  searchTerm = ''; 
  isSearching = false;
  searchResults: UserData | null = null;
  usersByRole: UserData[] = [];
  isLoadingUsers = false;
  selectedUser: UserData | null = null;
  isUserModalOpen = false;
  currentPage = 1;
  pageSize = 10;
  hasMoreUsers = true;
  
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

  ngOnInit() {
  if (this.selectedRole) {
    setTimeout(() => {
      this.loadUsersByRole();
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
  
  async searchUserByIdCard(): Promise<void> {
    if (!this.searchTerm.trim()) {
      this.toastService.show('Ingrese un número de documento', 'warning');
      this.searchResults = null;
      return;
    }

    if (!/^\d{7,10}$/.test(this.searchTerm)) {
      this.toastService.show('El documento debe tener 10 dígitos numéricos', 'warning');
      this.searchResults = null;
      return;
    }

    this.isSearching = true;
    this.searchResults = null;
    
    try {
      const endpoint = this.getEndpointByRole();
      const allUsers = await this.apiService.get(endpoint).toPromise();
      
      const usersArray = Array.isArray(allUsers) ? allUsers : 
                        allUsers.results ? allUsers.results : 
                        allUsers.data ? allUsers.data : [];
      
      const foundUser = usersArray.find((user: any) => user.id_card?.toString() === this.searchTerm.trim());
      
      if (foundUser) {
        this.searchResults = foundUser;
        this.fillFormWithSearchResults();
      } else {
        this.toastService.show('No se encontraron resultados', 'warning');
      }
    } catch (error: any) {
      console.error('Error en la búsqueda:', error);
      this.searchResults = null;
      if (error.status === 404) {
        this.toastService.show('Usuario no encontrado', 'warning');
      } else {
        this.toastService.show('Error al buscar usuario', 'danger');
      }
    } finally {
      this.isSearching = false;
    }
  }

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
      photo: null
    };
  }

  async loadUsersByRole(): Promise<void> {
    if (!this.selectedRole) {
      console.warn('Intento de carga sin rol seleccionado');
      return;
    }
    
    this.isLoadingUsers = true;
    this.usersByRole = [];
    this.currentPage = 1;
    this.hasMoreUsers = true;

    try {
      const endpoint = this.getEndpointByRole();
      
      const timestamp = new Date().getTime();
      const url = `${endpoint}?page=${this.currentPage}&page_size=${this.pageSize}&_=${timestamp}`;
      
      const response = await this.apiService.get(url).toPromise();
      
      let users = [];
      if (Array.isArray(response)) {
        users = response;
      } else if (response?.results) {
        users = response.results;
        this.hasMoreUsers = !!response.next;
      } else if (response?.data) {
        users = response.data;
        this.hasMoreUsers = !!response.next_page;
      } else {
        users = [];
        console.warn('Formato de respuesta no reconocido, usando array vacío');
      }

      this.usersByRole = users;

    } catch (error: any) {
      console.error('Error al cargar usuarios:', error);
      this.usersByRole = [];
      
      if (error.status != 404) {
        this.toastService.show('Error al cargar usuarios. Intente nuevamente.', 'danger', 3000);
      }
    }
  }

  async loadMoreUsers(event: any): Promise<void> {
    if (!this.hasMoreUsers) {
      event.target.complete();
      return;
    }

    this.currentPage++;
    
    try {
      const endpoint = this.getEndpointByRole();
      const response = await this.apiService.get(`${endpoint}?page=${this.currentPage}&page_size=${this.pageSize}`).toPromise();
      
      this.usersByRole = [...this.usersByRole, ...(response.results || response)];
      this.hasMoreUsers = response.next ? true : false;
      
    } catch (error) {
      this.toastService.show('Error al cargar más usuarios', 'danger');
    } finally {
      event.target.complete();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRole'] && !changes['selectedRole'].firstChange) {
      const previousRole = changes['selectedRole'].previousValue;
      const currentRole = changes['selectedRole'].currentValue;

      if (previousRole !== currentRole) {
        this.resetFormData();
        this.loadUsersByRole();
      }
    }
  }
}
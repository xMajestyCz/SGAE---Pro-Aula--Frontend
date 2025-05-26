import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/core/Services/api.service';
import { ToastService } from '../../services/toast.service';
import { UserData } from '../../models/user.model';
import { SupabaseService } from 'src/app/core/Services/supabase.service';
import { Guardian } from '../../models/guardian';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent {
  @Input() selectedRole: string = '';
  tabState: {[role: string]: string} = {};
  headers = ['Nombre', 'Documento', 'Teléfono', 'Email', 'Eliminar'];
  isLoading = false;
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
  private searchDebounceTimer: any;
  editUser: any = {}; 
  editSelectedImage: string | ArrayBuffer | null = null;
  editFileChanged = false;
  userToEdit: UserData | null = null;

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    if (this.selectedRole) {
      this.initializeRoleState(this.selectedRole);
      this.apiService.setSelectedRole(this.selectedRole);
      setTimeout(() => {
        this.loadUsersByRole();
      }, 500);
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
    console.log('Cargando usuario para editar:', user);
    
    this.userToEdit = JSON.parse(JSON.stringify(user));
    
    this.selectedTab = 'third';
    
    console.log('Datos preparados para edición:', this.userToEdit);
  }

  async deleteUser(event: Event, user: UserData): Promise<void> {
    event.stopPropagation(); 
    
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
        this.loadUsersByRole();
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
      
      await this.loadUsersByRole();
    } catch (error) {
      console.error('Error al cambiar de rol:', error);
      this.toastService.show('Error al cargar datos del nuevo rol', 'danger');
    } finally {
      this.isLoadingUsers = false;
    }
  }

  onUserCreated(newUser: UserData): void {
    this.usersByRole = [newUser, ...this.usersByRole];
  }
}
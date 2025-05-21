import { SupabaseService } from 'src/app/core/Services/supabase.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Guardian } from 'src/app/shared/models/guardian';
import { UserData } from 'src/app/shared/models/user.model';
import { UserFormService } from 'src/app/shared/services/user-form.service';
import { ApiService } from 'src/app/core/Services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: false,
})
export class UserFormComponent implements OnInit {
  @Input() role: string = '';

  selectedTab: 'first' | 'second' | 'third' = 'first';

  form!: FormGroup;
  isLoading = false;

  guardians: Guardian[] = [];
  usersByRole: UserData[] = [];
  isLoadingUsers = false;

  // Fechas para validación
  maxBirthDateStudent: Date;
  minBirthDateStudent: Date;
  maxBirthDateOtherRoles: Date;
  minBirthDateOtherRoles: Date;

  editUser: UserData | null = null;

  constructor(
    private formService: UserFormService,
    private fileUploadService: SupabaseService,
    private apiService: ApiService,
    private toastService: ToastService
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

    this.maxBirthDateOtherRoles = new Date(
      currentDate.getFullYear() - 20,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    this.minBirthDateOtherRoles = new Date(
      currentDate.getFullYear() - 80,
      currentDate.getMonth(),
      currentDate.getDate()
    );
  }

  ngOnInit(): void {
    this.form = this.formService.createForm(this.role);
    this.apiService.setSelectedRole(this.role);
    this.loadUsers();

    if (this.role === 'estudiante') {
      this.loadGuardians();
    }
  }

  async onSubmit(): Promise<void> {
    this.isLoading = true;

    try {
      let imageUrl = null;
      const imageValue = this.form.get('image')?.value;

      if (
        imageValue &&
        typeof imageValue === 'string' &&
        imageValue.startsWith('data:image')
      ) {
        imageUrl = await this.fileUploadService.uploadImage(
          this.role,
          imageValue
        );
      }

      this.form.patchValue({ image: imageUrl });

      const formData = this.formService.getUserDataFromForm(
        this.form,
        this.role
      );
      const endpoint = this.apiService.getEndpointByRole();

      await this.apiService.post(endpoint, formData).toPromise();

      this.toastService.show(
        `${this.capitalize(this.role)} registrado exitosamente`,
        'success'
      );
      this.form.reset();
      this.loadUsers();
    } catch (error: any) {
      console.error('Error al registrar:', error);
      this.toastService.show(
        error?.message || 'Error al registrar usuario',
        'danger'
      );
    } finally {
      this.isLoading = false;
    }
  }

  async loadUsers(): Promise<void> {
    try {
      this.isLoadingUsers = true;
      const endpoint = this.apiService.getEndpointByRole();
      const response = await this.apiService.get(endpoint).toPromise();
      this.usersByRole = Array.isArray(response)
        ? response
        : response?.results || [];
    } catch (error) {
      this.toastService.show('Error al cargar usuarios', 'danger');
    } finally {
      this.isLoadingUsers = false;
    }
  }

  async handleDeleteUser(user: UserData): Promise<void> {
    const confirm = window.confirm(
      `¿Deseas eliminar a ${user.first_name} ${user.first_lastname}?`
    );
    if (!confirm) return;

    try {
      this.isLoadingUsers = true;
      const endpoint = this.apiService.getEndpointByRole();
      await this.apiService.delete(endpoint, user.id_card).toPromise();
      this.toastService.show('Usuario eliminado correctamente', 'success');
      this.loadUsers();
    } catch (error: any) {
      console.error(error);
      this.toastService.show(
        error?.message || 'Error al eliminar usuario',
        'danger'
      );
    } finally {
      this.isLoadingUsers = false;
    }
  }

  handleUserSelected(user: UserData): void {
    this.selectedTab = 'third';
    this.editUser = user;
  }

  async handleSaveEdit(form: FormGroup): Promise<void> {
    if (!this.editUser?.id_card) {
      this.toastService.show(
        'No se puede actualizar: usuario sin ID',
        'danger'
      );
      return;
    }

    this.isLoading = true;

    try {
      let imageUrl = this.editUser.image;
      const imageValue = form.get('image')?.value;

      if (
        imageValue &&
        typeof imageValue === 'string' &&
        imageValue.startsWith('data:image')
      ) {
        imageUrl = await this.fileUploadService.uploadImage(
          this.role,
          imageValue
        );
      } else if (!imageValue) {
        imageUrl = null;
      }

      const updatePayload = {
        address: form.get('address')?.value,
        phone: form.get('phone')?.value,
        email: form.get('email')?.value,
        image: imageUrl,
      };

      const endpoint = this.apiService.getEndpointByRole();
      await this.apiService
        .put(`${endpoint}${this.editUser.id_card}/`, updatePayload)
        .toPromise();

      this.toastService.show(
        `${this.capitalize(this.role)} actualizado exitosamente`,
        'success'
      );
      this.loadUsers();
      this.selectedTab = 'first';
      this.editUser = null;
    } catch (error: any) {
      console.error('Error al actualizar:', error);
      this.toastService.show(
        error?.message || 'Error al actualizar usuario',
        'danger'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private async loadGuardians(): Promise<void> {
    try {
      const response = await this.apiService.get('guardians/').toPromise();
      this.guardians = Array.isArray(response)
        ? response
        : response?.results || [];
    } catch (error) {
      this.toastService.show('Error al cargar acudientes', 'danger');
    }
  }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}

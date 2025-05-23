// src/app/features/enrollment/pages/enrollment/enrollment.component.ts
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

// Importa los servicios

import { ToastService } from 'src/app/shared/services/toast.service';
import { LoggerService } from 'src/app/core/Services/logger.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { EnrollmentService } from 'src/app/core/Services/enrollment.service'; // Asegúrate de que esta ruta sea correcta

// Importa los modelos
import { Enrollment } from 'src/app/shared/models/enrollment';
import { Group } from 'src/app/shared/models/group';
import { StudentInfo } from 'src/app/shared/models/student-info';
import { finalize, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs'; // Necesario para tipado de observables
import { EnrollmentSearchComponent } from './enrollment-search/enrollment-search.component';
import { EnrollmentformComponent } from './enrollmentform/enrollmentform.component'; // Asegúrate de que esta ruta sea correcta
import { EnrollmentEditComponent } from './enrollment-edit-form/enrollment-edit-form.component';

// Importa LoadService
import { LoadService } from 'src/app/core/Services/load.service'; // Ajusta la ruta si es necesario

// Importa los componentes hijos

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
  standalone: false, // ¡Importante para componentes standalone!
})
export class EnrollmentComponent implements OnInit {
  // Referencias a los componentes hijos para llamar a sus métodos
  @ViewChild(EnrollmentformComponent) enrollmentFormCmp!: EnrollmentformComponent;
  @ViewChild(EnrollmentSearchComponent) enrollmentSearchCmp!: EnrollmentSearchComponent;
  @ViewChild(EnrollmentEditComponent) enrollmentEditCmp!: EnrollmentEditComponent;

  // Estados de la UI
  selectedTab: string = 'first';
  foundEnrollment: Enrollment | null = null;
  enrollmentToUpdate: Enrollment | null = null;
  searchAttempted: boolean = false;
  searchAttemptedModify: boolean = false;

  // Indicadores de carga y envío (gestionados en este componente para la UI global o en hijos para específicas)
  isSubmitting: boolean = false;
  isSearching: boolean = false;
  isLoadingForUpdate: boolean = false;
  isUpdating: boolean = false;
  isDeleting: boolean = false;
  enrollmentSuccess: boolean = false;

  // Caches para mapear IDs a nombres (gestionados por el componente principal)
  _studentsCache: { [id: number]: StudentInfo } = {};
  _groupsCache: { [id: number]: Group } = {};

  constructor(
    public loadService: LoadService, // Hacemos loadService público para usar sus observables directamente en el HTML
    private enrollmentService: EnrollmentService, // El nuevo servicio para operaciones de matrícula
    private toastService: ToastService,
    private loggerService: LoggerService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // Suscribirse a los observables de LoadService para llenar los caches
    this.loadService.students$.subscribe((students: StudentInfo[]) => {
      students.forEach(s => this._studentsCache[s.id] = s);
    });
    this.loadService.groups$.subscribe((groups: Group[]) => {
      groups.forEach(g => this._groupsCache[g.id] = g);
    });

    // Cargar datos iniciales al inicio del componente
    this.loadService.loadAllCommonData().subscribe({
      next: () => this.loggerService.logInfo('Datos iniciales de grupos y estudiantes cargados.'),
      error: (err) => this.loggerService.logError('Fallo al cargar datos iniciales:', err)
    });
  }

  // --- Manejo de Pestañas ---
  onSegmentChanged(event: any) {
    this.selectedTab = event.detail.value;
    this.resetComponentStates();
  }

  private resetComponentStates() {
    this.foundEnrollment = null;
    this.enrollmentToUpdate = null;
    this.searchAttempted = false;
    this.searchAttemptedModify = false;
    this.isSearching = false;
    this.isLoadingForUpdate = false;
    this.isSubmitting = false;
    this.isUpdating = false;
    this.isDeleting = false;
    this.enrollmentSuccess = false;

    // Llama a los métodos de reseteo de los componentes hijos
    this.enrollmentFormCmp?.resetForm();
    this.enrollmentSearchCmp?.resetForm();
    this.enrollmentEditCmp?.resetForms();

    this.loggerService.logInfo(`Cambio de pestaña a: ${this.selectedTab}. Estados reseteados.`);
  }

  // --- Métodos delegados a EnrollmentService ---

  createEnrollment(enrollmentData: Enrollment) {
    this.enrollmentSuccess = false;
    this.isSubmitting = true;
    this.enrollmentService.createEnrollment(enrollmentData).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.enrollmentSuccess = true;
        this.enrollmentFormCmp.resetForm(); // Resetear formulario hijo
        setTimeout(() => this.enrollmentSuccess = false, 3000);
        this.loadService.loadAllCommonData().subscribe(); // Recargar datos comunes para actualizar cupos
      },
      error: (err) => {
        this.loggerService.logError('Error en createEnrollment (componente principal):', err);
        // El ToastService ya lo maneja el EnrollmentService, aquí solo logueamos o hacemos algo más específico de UI si es necesario
      }
    });
  }

  searchEnrollment(query: string) {
    this.searchAttempted = true;
    this.foundEnrollment = null;
    this.isSearching = true;

    let searchObservable: Observable<Enrollment | Enrollment[] | null>;
    if (!isNaN(Number(query))) { // Si es un número, intentar buscar por ID de matrícula
      searchObservable = this.enrollmentService.getEnrollmentById(Number(query));
    } else {
      // Si no es un número, podrías buscar por nombre de estudiante o ID de estudiante (simulado)
      const student = Object.values(this._studentsCache).find(s => s.id === Number(query));
      if (student) {
        searchObservable = this.enrollmentService.getEnrollmentsByStudentId(student.id).pipe(
          map(enrollments => enrollments && enrollments.length > 0 ? enrollments[0] : null) // Toma la primera si hay varias
        );
      } else {
        searchObservable = of(null); // No se encontró estudiante
      }
    }

    searchObservable.pipe(
      finalize(() => this.isSearching = false)
    ).subscribe({
      next: (enrollment: Enrollment | null | Enrollment[]) => {
        if (Array.isArray(enrollment)) { // Si getEnrollmentsByStudentId devuelve un array
          this.foundEnrollment = enrollment.length > 0 ? enrollment[0] : null;
        } else { // Si getEnrollmentById devuelve un solo objeto o null
          this.foundEnrollment = enrollment;
        }
      },
      error: (err) => {
        this.foundEnrollment = null; // Asegurarse de limpiar en caso de error
        this.loggerService.logError('Error en searchEnrollment (componente principal):', err);
      }
    });
  }

  loadEnrollmentForUpdate(id: number) {
    this.searchAttemptedModify = true;
    this.enrollmentToUpdate = null;
    this.isLoadingForUpdate = true;
    this.enrollmentService.getEnrollmentById(id).pipe(
      finalize(() => this.isLoadingForUpdate = false)
    ).subscribe({
      next: (enrollment: Enrollment | null) => {
        this.enrollmentToUpdate = enrollment;
      },
      error: (err) => {
        this.enrollmentToUpdate = null;
        this.loggerService.logError('Error en loadEnrollmentForUpdate (componente principal):', err);
      }
    });
  }

  updateEnrollment(updatedEnrollment: Enrollment) {
    if (updatedEnrollment.id === undefined) {
      this.toastService.error('ID de matrícula no válido para actualizar.');
      return;
    }
    this.isUpdating = true;
    this.enrollmentService.updateEnrollment(updatedEnrollment.id, updatedEnrollment).pipe(
      finalize(() => this.isUpdating = false)
    ).subscribe({
      next: () => {
        this.enrollmentEditCmp.resetForms(); // Resetear formulario hijo
        this.enrollmentToUpdate = null;
        this.searchAttemptedModify = false;
        this.loadService.loadAllCommonData().subscribe(); // Recargar datos comunes (incluye grupos)
      },
      error: (err) => {
        this.loggerService.logError('Error en updateEnrollment (componente principal):', err);
      }
    });
  }

  async confirmDelete() {
    if (!this.enrollmentToUpdate || this.enrollmentToUpdate.id === undefined) {
      this.toastService.error('Primero debes cargar una matrícula para poder eliminarla.');
      return;
    }
    const confirmed = await this.alertService.showDeleteConfirmation(this.enrollmentToUpdate.id);
    if (confirmed) {
      this.deleteEnrollment(this.enrollmentToUpdate.id);
    } else {
      this.loggerService.logInfo('Eliminación de matrícula cancelada por el usuario.');
    }
  }

  deleteEnrollment(id: number) {
    this.isDeleting = true;
    this.enrollmentService.deleteEnrollment(id).pipe(
      finalize(() => this.isDeleting = false)
    ).subscribe({
      next: () => {
        this.enrollmentEditCmp.resetForms(); // Resetear formulario hijo
        this.enrollmentToUpdate = null;
        this.searchAttemptedModify = false;
        this.loadService.loadAllCommonData().subscribe(); // Recargar datos comunes (incluye grupos)
      },
      error: (err) => {
        this.loggerService.logError('Error en deleteEnrollment (componente principal):', err);
      }
    });
  }
}
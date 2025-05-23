// src/app/core/services/enrollment.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service'; // Asume que ya existe
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoggerService } from './logger.service';
import { Enrollment } from 'src/app/shared/models/enrollment';
import { StudentInfo } from 'src/app/shared/models/student-info';
import { Group } from 'src/app/shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  // Aquí podrías tener BehaviorSubjects para manejar el estado de las matrículas cargadas si es necesario

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private loggerService: LoggerService
  ) {}

  // --- Operaciones CRUD ---

  createEnrollment(enrollmentData: Enrollment): Observable<Enrollment> {
    // Aquí se harían validaciones de negocio REALES, idealmente en el backend
    // Si la validación es compleja y puede hacerse en frontend para UX, aquí iría.
    // Ej: pre-validación de formato, no de lógica de negocio profunda.

    this.loggerService.logInfo('Enviando matrícula a API: ' + JSON.stringify(enrollmentData));
    return this.apiService.post('enrollments', enrollmentData).pipe(
      tap(() => {
        this.toastService.success('Matrícula creada correctamente.');
        this.loggerService.logInfo('Matrícula creada con éxito.');
      }),
      catchError(error => {
        const errorMessage = error.error?.message || error.statusText || 'Error desconocido al matricular';
        this.toastService.error(`Error al matricular: ${errorMessage}`);
        this.loggerService.logError('Error en createEnrollment:', error);
        return throwError(() => new Error(errorMessage)); // Propagar error
      })
    );
  }

  getEnrollmentById(id: number): Observable<Enrollment | null> {
    this.loggerService.logInfo(`Buscando matrícula ID: ${id}`);
    return this.apiService.get(`enrollments/${id}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          this.toastService.error('Matrícula no encontrada.');
          this.loggerService['logWarn'](`Matrícula con ID ${id} no encontrada.`);
        } else {
          const errorMessage = error.error?.message || error.statusText || 'Error desconocido al buscar matrícula';
          this.toastService.error(`Error al buscar matrícula: ${errorMessage}`);
          this.loggerService.logError(`Error en getEnrollmentById (ID: ${id}):`, error);
        }
        return of(null); // Retorna null para que el componente lo maneje
      })
    );
  }

  // Podrías tener un método para buscar por studentId si tu API lo soporta
  getEnrollmentsByStudentId(studentId: number): Observable<Enrollment[] | null> {
    this.loggerService.logInfo(`Buscando matrículas para estudiante ID: ${studentId}`);
    return this.apiService.get(`enrollments?studentId=${studentId}`).pipe(
      catchError(error => {
        const errorMessage = error.error?.message || error.statusText || 'Error desconocido al buscar matrículas del estudiante';
        this.toastService.error(`Error al buscar matrículas del estudiante: ${errorMessage}`);
        this.loggerService.logError(`Error en getEnrollmentsByStudentId (studentId: ${studentId}):`, error);
        return of(null);
      })
    );
  }

  updateEnrollment(id: number, enrollmentData: Enrollment): Observable<Enrollment> {
    this.loggerService.logInfo(`Actualizando matrícula ID: ${id}. Datos: ${JSON.stringify(enrollmentData)}`);
    return this.apiService.put(`enrollments/${id}`, enrollmentData).pipe(
      tap(() => {
        this.toastService.success('Matrícula actualizada correctamente.');
        this.loggerService.logInfo('Matrícula actualizada con éxito.');
      }),
      catchError(error => {
        const errorMessage = error.error?.message || error.statusText || 'Error desconocido al actualizar matrícula';
        this.toastService.error(`Error al actualizar matrícula: ${errorMessage}`);
        this.loggerService.logError('Error en updateEnrollment:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteEnrollment(id: number): Observable<void> {
    this.loggerService.logInfo(`Eliminando matrícula ID: ${id}`);
    return this.apiService.delete('enrollments/', id).pipe(
      tap(() => {
        this.toastService.success('Matrícula eliminada correctamente.');
        this.loggerService.logInfo('Matrícula eliminada con éxito.');
      }),
      catchError(error => {
        const errorMessage = error.error?.message || error.statusText || 'Error desconocido al eliminar matrícula';
        this.toastService.error(`Error al eliminar matrícula: ${errorMessage}`);
        this.loggerService.logError('Error en deleteEnrollment:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // --- Validaciones de Negocio (SIMULADAS - estas deben venir del backend) ---
  // Aunque estas validaciones deberían residir en el backend, si se necesitan en frontend
  // para una UX inmediata, se podrían poner aquí. Pero siempre con una validación final
  // en el backend.

  // Podrías pasar los caches de estudiantes y grupos aquí si los necesitas para validaciones
  // muy básicas o para preparar los datos.
  checkPrerequisites(studentId: number, groupId: number, students: StudentInfo[], groups: Group[]): boolean {
    // Lógica compleja que podría depender del historial del estudiante y los prerequisitos del curso
    return true; // Simulación
  }

//   checkCapacity(groupId: number, groups: Group[]): boolean {
//     const group = groups.find(g => g.id === groupId);
//     if (group && group.enrolled_students !== undefined && group.capacity !== undefined) {
//       return group.enrolled_students < group.capacity;
//     }
//     this.loggerService['logWarn'](`No se pudo verificar la capacidad para el grupo ${groupId}.`);
//     return true; // Asume que hay cupo si no se puede verificar
//   }

//   checkDuplicateEnrollment(studentId: number, groupId: number, currentEnrollments: Enrollment[]): boolean {
//     // Esto implicaría que el servicio mantenga un estado de las matrículas o las busque
//     return currentEnrollments.some(e => e.studentId === studentId && e.groupId === groupId);
//   }
}
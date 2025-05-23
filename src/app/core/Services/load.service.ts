import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { StudentInfo } from 'src/app/shared/models/student-info'; // Asegúrate de que la ruta sea correcta
import { Group } from 'src/app/shared/models/group';         // Asegúrate de que la ruta sea correcta
import { ApiService } from './api.service'; // Asegúrate de que la ruta sea correcta y que ApiService exista
import { LoggerService } from './logger.service'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root' // Esto hace que el servicio sea un Singleton y esté disponible en toda la aplicación
})
export class LoadService {
  // BehaviorSubjects para almacenar y emitir los datos y sus estados de carga
  private _students = new BehaviorSubject<StudentInfo[]>([]);
  private _groups = new BehaviorSubject<Group[]>([]);

  private _isStudentsLoading = new BehaviorSubject<boolean>(false);
  private _isGroupsLoading = new BehaviorSubject<boolean>(false);

  // Observables públicos para que los componentes puedan suscribirse a los datos y estados de carga
  readonly students$ = this._students.asObservable();
  readonly groups$ = this._groups.asObservable();
  readonly isStudentsLoading$ = this._isStudentsLoading.asObservable();
  readonly isGroupsLoading$ = this._isGroupsLoading.asObservable();

  constructor(
    private apiService: ApiService,
    private loggerService: LoggerService
  ) {
    // Puedes cargar los datos comunes al iniciar el servicio, si es necesario para toda la app.
    // O puedes llamar a loadAllCommonData() desde tu AppComponent o un módulo específico.
    // this.loadAllCommonData().subscribe();
  }

  /**
   * Carga la lista de estudiantes desde la API.
   */
  loadStudents(): Observable<StudentInfo[]> {
    this._isStudentsLoading.next(true);
    this.loggerService.logInfo('LoadService: Cargando estudiantes...');
    return this.apiService.get('students/info').pipe( // Asume un endpoint 'students/info' para datos simplificados
      tap(students => {
        this._students.next(students);
        this.loggerService.logInfo('LoadService: Estudiantes cargados exitosamente: ' + JSON.stringify(students));
      }),
      finalize(() => this._isStudentsLoading.next(false)),
      catchError(error => {
        this.loggerService.logError('LoadService: Error al cargar estudiantes:', error);
        this._students.next([]); // Limpia los estudiantes en caso de error
        return throwError(() => new Error('Error al cargar estudiantes.'));
      })
    );
  }

  /**
   * Carga la lista de grupos desde la API.
   */
  loadGroups(): Observable<Group[]> {
    this._isGroupsLoading.next(true);
    this.loggerService.logInfo('LoadService: Cargando grupos...');
    return this.apiService.get('groups').pipe( // Asume un endpoint 'groups'
      tap(groups => {
        this._groups.next(groups);
        this.loggerService.logInfo('LoadService: Grupos cargados exitosamente: ' + JSON.stringify(groups));
      }),
      finalize(() => this._isGroupsLoading.next(false)),
      catchError(error => {
        this.loggerService.logError('LoadService: Error al cargar grupos:', error);
        this._groups.next([]); // Limpia los grupos en caso de error
        return throwError(() => new Error('Error al cargar grupos.'));
      })
    );
  }

  /**
   * Carga tanto estudiantes como grupos en paralelo.
   * Útil para inicializar datos al cargar una vista.
   */
  loadAllCommonData(): Observable<[StudentInfo[], Group[]]> {
    this.loggerService.logInfo('LoadService: Iniciando carga de todos los datos comunes (estudiantes y grupos)...');
    return combineLatest([
      this.loadStudents(),
      this.loadGroups()
    ]).pipe(
      tap(() => this.loggerService.logInfo('LoadService: Todos los datos comunes cargados.')),
      catchError(error => {
        this.loggerService.logError('LoadService: Fallo al cargar todos los datos comunes:', error);
        return throwError(() => new Error('Fallo al cargar datos comunes.'));
      })
    );
  }

  /**
   * Devuelve el valor actual de los estudiantes (no un Observable).
   * Útil si necesitas el valor instantáneo sin suscribirte.
   */
  getCurrentStudents(): StudentInfo[] {
    return this._students.getValue();
  }

  /**
   * Devuelve el valor actual de los grupos (no un Observable).
   */
  getCurrentGroups(): Group[] {
    return this._groups.getValue();
  }
}
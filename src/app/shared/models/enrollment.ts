export interface Enrollment {
  id?: number; // El ID podría ser opcional si el backend lo genera
  student: number; // El ID del estudiante, tal como lo esperas en tu API
  group: number;
  name: string;  
  enrollment_date: string; // O Date si lo manejas así
  status: 'active' | 'inactive';
  academic_year: number;
  observations: string;
}

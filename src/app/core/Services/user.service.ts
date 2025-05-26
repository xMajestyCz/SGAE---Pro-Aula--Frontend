import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

async getUserImage(userId: string, role: string, fileName: string): Promise<string | null> {
  try {
    console.log('Buscando imagen:', fileName, 'para usuario:', userId);
    
    if (!fileName) {
      console.warn('No hay nombre de archivo para este usuario');
      return null;
    }

    const { data } = await this.supabaseService.getImageUrl(
      environment.supabaseBucket,
      `${role}/${fileName}` // <-- Usa el nombre de archivo completo
    );
    
    console.log('URL generada:', data?.publicUrl);
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Error obteniendo imagen:', error);
    return null;
  }
}
}
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  async getUserImage(userId: string, role: string): Promise<string | null> {
    try {
      const { data } = await this.supabaseService.getImageUrl(
        environment.supabaseBucket,
        `${role}/${userId}`
      );
      return data?.publicUrl || null;
    } catch (error) {
      console.error('Error obteniendo imagen:', error);
      return null;
    }
  }
}
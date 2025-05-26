import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
  }

  async uploadImage(bucket: string, path: string, file: File): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${path}/${fileName}`;
    
    try {
      const { data, error } = await this.supabase
        .storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = this.supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async getImageUrl(bucket: string, path: string): Promise<any> {
    return this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
  }
}
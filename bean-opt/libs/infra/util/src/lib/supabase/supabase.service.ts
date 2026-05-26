import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../app-config.token';
import { Database } from './database.types';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private config = inject(APP_CONFIG);
  private _client: SupabaseClient<Database>;

  constructor() {
    if (this.config.supabaseConfig === undefined){
      throw new Error('Supabase configuration is not provided in the application configuration');
    }

    this._client = createClient<Database>(
      this.config.supabaseConfig.supabaseUrl,
      this.config.supabaseConfig.supabaseKey
    );
  }

  get client(): SupabaseClient<Database> {
    return this._client;
  }
}

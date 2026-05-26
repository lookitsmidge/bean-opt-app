import { InjectionToken } from '@angular/core';

export interface AppConfig {
    /** The configuration for the Firebase instance */
    firebaseConfig?: {
        apiKey: string,
        authDomain: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string,
        appId: string,
        measurementId?: string
    };
    /** The configuration for the Supabase instance */
    supabaseConfig?: {
        /** The URL of the Supabase instance */
        supabaseUrl: string;
        /** The publishable API key for the Supabase instance */
        supabaseKey: string;
    };
    /** The ID for the application */
    appId: string;
    /** Whether the application is in production mode */
    production: boolean;
    /** Optional The public domain for the R2 storage */
    r2PublicDomain?: string;
}

/** Injection token for the application configuration */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

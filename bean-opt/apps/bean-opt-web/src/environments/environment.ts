import { AppConfig } from '@boa/infra-util';

export const environment: AppConfig = {
    production: false,
    appId: 'bean-opt-web',
    supabaseConfig: {
        supabaseUrl: 'http://127.0.0.1:54321',
        supabaseKey: 'your-supabase-key'
    }
}
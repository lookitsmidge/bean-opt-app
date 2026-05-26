export interface DataRepositoryGeneratorSchema {
  name: string;
  project: string;
  type: 'firebase' | 'supabase';
}

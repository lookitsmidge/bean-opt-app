# libs/core/auth/data-access

The infrastructure implementation layer for Authentication.

## Functionality
Provides concrete implementations of the repository interfaces defined in the domain layer. It handles the actual communication with Supabase (and legacy Firebase) for authentication and profile management.

## Exports
- **Repositories**: `SupabaseAuthRepository`, `SupabaseProfileRepository`
- **Legacy**: `FirebaseAuthRepository`, `FirebaseProfileRepository`
- **Guards**: `IsAuthenticatedGuard`, `NotAnonymousGuard`

## Technical Nuances
- **Supabase Native SDK**: Aligns with the project mandate to use `@supabase/supabase-js`.
- **Hybrid Support**: Temporarily contains Firebase repositories during the migration phase.
- **RLS**: Works in tandem with Supabase Row Level Security (RLS) policies defined in the database migrations.

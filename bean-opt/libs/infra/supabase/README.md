# libs/infra/supabase

Administrative and CLI integration for Supabase.

## Functionality
This is a configuration-only library that provides Nx targets for managing the Supabase backend. It does not contain application code but serves as the orchestration point for database migrations and type generation.

## Nx Targets
- `nx status infra-supabase`: Check the local Supabase status.
- `nx db-pull infra-supabase`: Pull the latest schema from the remote database.
- `nx db-push infra-supabase`: Push local migrations to the database.
- `nx gen-types infra-supabase`: Generate TypeScript definitions from the database schema into `libs/infra/util`.

## Technical Nuances
- **Type Generation**: The `gen-types` target is critical for maintaining type-safety between the PostgreSQL schema and the Angular frontend.
- **Local Dev**: Requires the Supabase CLI to be installed.

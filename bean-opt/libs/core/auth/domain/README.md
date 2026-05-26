# libs/core/auth/domain

The core business logic and interface definitions for the Authentication and User Identity domain.

## Functionality
Defines the structure of Auth and Profile data and the contracts (interfaces) for data persistence. This library is pure TypeScript and has no dependencies on external frameworks or infrastructure.

## Exports
- **Models**: `AuthUser`, `Profile` (via `auth.model.ts`)
- **Interfaces**: `IAuthRepository`, `IProfileRepository`
- **Tokens**: `AUTH_REPOSITORY_TOKEN`, `PROFILE_REPOSITORY_TOKEN` (for Injection)

## Technical Nuances
- **Architecture**: Acts as the "Tier 1" library for the Auth stack.
- **Inversion of Control**: Allows the application to depend on abstractions rather than concrete Supabase or Firebase implementations.
- **Role Sync**: Includes definitions for user roles (Commander, Moderator, Seller) which are synced to Supabase `app_metadata`.

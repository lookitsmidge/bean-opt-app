# libs/core/auth/feature

Smart components and routing for the Authentication and User management flows.

## Functionality
Orchestrates the login, signup, and administrative user management views. It connects the UI components to the Signal Stores in the application layer.

## Exports
- **Routes**: `AUTH_ROUTES` (Login, Signup, Profile)
- **Guards**: `RoleGuard` (Admin/Moderator access control)

## Technical Nuances
- **Routing**: Implements the stacked responsive layout for auth pages.
- **Admin Integration**: Powers the User Governance dashboard for administrative tasks.

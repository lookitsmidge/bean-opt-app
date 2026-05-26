# libs/core/auth/application

The orchestration layer for Authentication and User state management.

## Functionality
Houses the reactive state for the current user and their profile. It manages the flow of data between the UI (features) and the data layer (repositories).

## Exports
- **Stores**: `AuthStore`, `ProfileStore`, `UsersStore` (Admin focus)

## Technical Nuances
- **State Management**: Built using **NgRx Signal Stores** for high-performance, granular reactivity.
- **Admin Logic**: The `UsersStore` contains the logic for managing other users (roles, banning, termination) used by the Admin Dashboard.
- **Zoneless Readiness**: Optimized for Angular 21's signal-based architecture.

# BeanOpt Full Application Build Plan (4-Tier DDD Architecture)

This document outlines the detailed build plan to implement the BeanOpt espresso shot tracking and optimization platform, following the strict 4-tier DDD structure (+ presentational UI tier) of the monorepo architecture and referencing the features of [project-roadmap.md](file:///home/jamesmartland/Projects/bean-opt-app/documentation/project-roadmap.md).

---

## Architectural Library Tiers

For each core feature domain, code must be cleanly separated into the following tiers under `libs/features/[domain-name]/`:
1.  **`domain`**: Core models, interfaces, and repository token definitions (pure TypeScript, no external dependencies).
2.  **`application`**: State orchestration, side-effects, and **NgRx Signal Stores**.
3.  **`data-access`**: Supabase repository implementations and data fetching adapters (implements `domain` repository interfaces).
4.  **`feature`**: Smart/Routable components and page container components. Injects state stores and maps logic.
5.  **`ui`**: Dumb presentational components. Uses strict inputs (`input()`) and outputs (`output()`), and never injects stores.

### Scaffolding Command References
Use the custom generators defined in `@wfi/infra/tooling` to scaffold these tiers:
*   `npx nx g @wfi/infra/tooling:domain-shell --name=[domain]`
*   `npx nx g @wfi/infra/tooling:data-repository --name=[domain]`
*   `npx nx g @wfi/infra/tooling:signal-store-feature --name=[domain]`
*   `npx nx g @wfi/infra/tooling:feature-view --name=[domain]`
*   `npx nx g @wfi/infra/tooling:ui-component --name=[domain]`

---

## 1. Core Authentication & User Governance
*Located in the shared core library at `libs/core/auth`.*

### A. Database Migration (`supabase/migrations/`)
*   Create a migration to set up the `user_profiles` table linked to Supabase's `auth.users` schema.
*   Implement pgSQL function and trigger `handle_new_user_signup` to auto-populate the user profile table upon sign-up.
*   Implement JWT Claims Sync: database trigger to map user roles (e.g. `admin`, `user`) directly into `auth.users.app_metadata` for fast, join-free Row Level Security (RLS) policies.
*   Define RLS rules on `user_profiles`: Users can read/write their own records only.

### B. Core Auth Tiers (`libs/core/auth/src/lib/`)
*   **`domain`**:
    *   Models: `UserProfile`, `UserRole`, `SessionState` (enum).
    *   Interfaces: `IAuthRepository` injection token.
*   **`data-access`**:
    *   `AuthRepository` implementing `IAuthRepository` using native `@supabase/supabase-js`.
*   **`application`**:
    *   `AuthStore` (NgRx Signal Store) tracking `currentUser`, `session`, `loading`, and `error`.
    *   `AuthGuard` (Angular Route Guard) restricting access to authenticated users.
*   **`feature`**:
    *   `LoginViewComponent` / `RegisterViewComponent` coordinating page layout, social login hooks, and submitting forms.
*   **`ui`**:
    *   `LoginForm` / `RegisterForm` presentational components with custom validations and Google Sign-In triggers.

### C. Testing
*   Vitest unit testing of `AuthStore` and mock repository implementations.
*   Playwright E2E tests validating route redirection via `AuthGuard`.

---

## 2. Feature: Bean Management
*Located in `libs/features/beans`.*

### A. Database Migration (`supabase/migrations/`)
*   Create the `coffee_beans` table: `id` (UUID), `user_id` (FK to profiles), `name` (text), `roaster` (text), `roast_date` (date), `roast_level` (enum), `grind_range` (text), `cost_per_bag` (numeric), `bag_weight_grams` (numeric), `remaining_grams` (numeric), `notes` (text), `created_at`.
*   Enable RLS policies: Users can perform CRUD operations strictly on their own beans.

### B. Beans Feature Tiers
*   **`domain`** (`libs/features/beans/domain`):
    *   Models: `CoffeeBean`, `RoastLevel` (Light, Medium, Medium-Dark, Dark).
    *   Interfaces: `IBeanRepository` injection token.
*   **`data-access`** (`libs/features/beans/data-access`):
    *   `BeanRepository` implementing `IBeanRepository` using `@supabase/supabase-js`.
*   **`application`** (`libs/features/beans/application`):
    *   `BeanStore` (NgRx Signal Store) tracking all `beans`, the `activeHopperBean`, loading flags, and error states.
*   **`feature`** (`libs/features/beans/feature`):
    *   `BeansDashboardComponent` (smart container displaying the beans grid).
    *   `BeanDetailComponent` (smart component controlling additions and edits).
*   **`ui`** (`libs/features/beans/ui`):
    *   `BeanCard` presentational elements showing remaining balance progress bars.
    *   `BeanForm` presentational component with reactive forms and weight/cost validations.

### C. Testing
*   Vitest assertions for `BeanStore` loading and editing actions.
*   Playwright E2E tests checking bag registration and balance decrements.

---

## 3. Feature: Run Management (Shot Logger & Timer)
*Located in `libs/features/runs`.*

### A. Database Migration (`supabase/migrations/`)
*   Create the `shot_runs` table: `id` (UUID), `user_id` (FK), `bean_id` (FK to `coffee_beans` ON DELETE CASCADE), `grams_in` (numeric), `grams_out` (numeric), `extraction_time` (numeric), `grind_setting` (text), `double_shot` (boolean), `rating` (numeric 1-5), `taste_notes` (text), `profile_data` (JSONB for real-time profiling), `created_at`.
*   Create database trigger functions to automatically decrement `remaining_grams` in `coffee_beans` by the logged `grams_in` whenever a new run is recorded.
*   Set up RLS policies: Owner-restricted access.

### B. Runs Feature Tiers
*   **`domain`** (`libs/features/runs/domain`):
    *   Models: `ShotRun`, `ShotProfilePoint` (time/weight data arrays).
    *   Interfaces: `IRunRepository` injection token.
*   **`data-access`** (`libs/features/runs/data-access`):
    *   `RunRepository` implementing `IRunRepository` via Supabase client.
*   **`application`** (`libs/features/runs/application`):
    *   `RunStore` (NgRx Signal Store) tracking run records, active timer logs, and extraction metrics.
*   **`feature`** (`libs/features/runs/feature`):
    *   `BrewSessionComponent` (smart component running the stopwatch and managing real-time scales).
    *   `RunHistoryComponent` (smart component listing historical extractions).
*   **`ui`** (`libs/features/runs/ui`):
    *   `TimerDisplay` presentational timer.
    *   `ExtractionChart` svg graph drawing real-time flow rate curves.
    *   `RunLogForm` presentational logger form (star rating selector, notes).

### C. Testing
*   Unit tests checking stopwatch accuracy, math helpers, and repository CRUD functions.
*   Playwright tests verifying extraction saves and hopper balance updates.

---

## 4. Feature: Shot Diagnosis (Shot Doctor)
*Located in `libs/features/diagnostics`.*

### A. Database Migration (`supabase/migrations/`)
*   Create `shot_diagnoses` table: `id` (UUID), `run_id` (FK to `shot_runs` ON DELETE CASCADE), `issue_type` (text), `recommendations` (JSONB), `created_at`.
*   Enable RLS policies: Owner-restricted access.

### B. Diagnostics Feature Tiers
*   **`domain`** (`libs/features/diagnostics/domain`):
    *   Models: `DiagnosisInput`, `DiagnosisResult`, `TuningStep`.
    *   Interfaces: `IDiagnosticRepository` injection token.
*   **`data-access`** (`libs/features/diagnostics/data-access`):
    *   `DiagnosticRepository` implementing `IDiagnosticRepository` for database syncs.
*   **`application`** (`libs/features/diagnostics/application`):
    *   `ShotDoctorStore` managing wizard steps, active parameters, and generated advice.
    *   `ShotDoctorService` implementing troubleshooting decision-tree algorithms based on shot time, yields, and flavor notes.
*   **`feature`** (`libs/features/diagnostics/feature`):
    *   `DoctorWizardComponent` (smart component orchestrating the troubleshooting multi-step questionnaire).
*   **`ui`** (`libs/features/diagnostics/ui`):
    *   `FeedbackQuestionCard` presentational elements for choosing flavors/visual symptoms.
    *   `TuningCard` presentational cards detailing corrective actions (grind adjustments, temp changes).

### C. Testing
*   Unit tests covering the troubleshooting rule engine (bitter/sour/fast/slow combinations).
*   Playwright E2E tests validating step transitions in the troubleshooting wizard.

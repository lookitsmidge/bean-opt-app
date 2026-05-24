# LLM Pre-Task Brief (WFi Platform)

*If you are an AI assistant (like Gemini Flash) tasked with implementing a feature for the WFi platform, you MUST read and acknowledge these rules before writing any code.*

## 1. Architectural Integrity (The Gold Standard)
The project strictly follows the rules defined in `wfi-vault/documentation/architecture-manifesto.md`.
- **Nx Monorepo (DDD)**: For major epics or feature domains (e.g., `shop`, `network`, `catalog`), maintain the strict 4-tier library structure (`domain`, `application`, `data-access`, `feature`, `ui`). Do not mix concerns within these domains.
- **Shared Libraries**: In some cases (e.g., highly reusable components like `core/ui` or utility wrappers), shared code can be generated within a single, cohesive library rather than forcing an artificial 4-tier split.
- **Library Generation**: Use the Nx CLI (e.g., `npx nx g @nx/angular:library ...`) to scaffold new modules. Do not manually create folders.
- **Zoneless & Signals**: Do NOT use RxJS Observables for *persisting state*. All state must be managed via `@ngrx/signals`. However, RxJS is expected in data-access repositories and for stream operations (e.g., `debounceTime`, router events). These streams should be handled via `rxMethod` in the store or converted to Signals.
- **Change Detection**: Use `ChangeDetectionStrategy.OnPush` everywhere and rely strictly on Signal updates to trigger the UI. Do not manually inject `ChangeDetectorRef` unless absolutely necessary.

## 2. Component Architecture (Smart vs. Dumb)
- **Smart Components (Features)**: These routable components interact directly with the NgRx Signal Stores. They should be as "thin" as possible. The vast majority of business logic, state derivation, and data fetching MUST be encapsulated inside the Store.
- **Dumb Components (UI)**: These presentation components must NEVER inject a Signal Store. They receive data purely via Signal `input()` and communicate upwards via `@Output()`.

## 3. Design System (Material 3 Expressive)
The platform uses a premium "Material 3 Expressive" aesthetic. Avoid high-contrast black borders for primary structural containers.
- **Component Reuse**: ALWAYS check for existing components in `libs/core/ui` (e.g., `AppButtonComponent`, `AppSegmentedControlComponent`) before building custom structural elements.
- **Tokens**: Use deep shadows (`shadow-xl`), extreme corner radii (`rounded-[2.5rem]`), and tonal backgrounds (`bg-white` or `bg-slate-50`) with subtle borders (`border-black/[0.03]`).
- Reference `libs/core/ui/src/lib/banners/premium-banner.component.ts` for the established style.

## 3. Database Constraints
- All backend changes must be codified as SQL migration files inside `supabase/migrations/`.
- Ensure all queries respect Row Level Security (RLS) policies.

## 4. The Step-Wise Development Workflow (CRITICAL)
The user runs the dev server locally and prefers a tight, incremental feedback loop. 
**DO NOT** attempt to build an entire epic or massive feature in one giant step.
1. Implement logical, testable chunks (which may include multi-component development if they are highly coupled, such as a Component + its Store).
2. **Stop and wait.** 
3. Explicitly ask the user to verify the build, check the live UI on the dev server, and provide feedback before proceeding to the next step.

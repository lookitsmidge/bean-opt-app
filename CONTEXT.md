# Context.md - BeanOpt Context

This file serves as the primary instructional context for the BeanOpt project, a premium lightweight full-stack web application for recording, tracking and optimising espresso shots.

## Project Overview

BeanOpt is built as an **NX Monorepo** using **Angular 21**. It is fully integrated with a high-performance **Supabase (PostGreSQL)** backend and hosted on **Cloudflare Pages**

The architecture follows a "Blueprint" strategy:

- **Thin Shell Apps**: Lightweight entry points.
- **Core Libraries**: Shared Auth, Navigation, Global Components and UI Theming.
- **Infra Libraries**: Standardized Supabase / Cloudflare deployment scripts and data repositories

>[!IMPORTANT]
>**Workspace Root**: The application root is located in the `bean-opt` directory. All commands (Nx, Supabase, etc.) MUST be executed from within the `bean-opt` directory.

## Core Stack

- **Framework**: Angular 21 (Standalone Components, Signals).
- **State Management**: NgRx Signals (`@ngrx/signals`).
- **Backend**: Supabase (Auth, PostgreSQL, Storage?).
- **Hosting**: Cloudflare Pages (via Wrangler).
- **Styling**: Material 3 with Tailwind CSS (Premium M3 Design system).

## Project Roadmap & Progress

The project's features and implementation status are tracked in:
`documentation/project-roadmap.md`

**Mandate**: This roadmap MUST be kept up-to-date after every significant implementation or architectural change. Always check this file to understand the current stage of development.

## Agent Orchestration Strategy

To maintain a lean main context and ensure high-fidelity implementation, follow these delegation rules:

- **Orchestrator Role**: The main session acts as the "Strategic Orchestrator." It handles architecture, planning, and high-level decisions.
- **Specialized Personas**:
  - **Research Engineer (`codebase_investigator`)**: For discovery, dependency mapping, and bug root-cause analysis.
  - **Programming Engineer (`generalist`)**: For feature implementation and refactoring.
  - **Testing Engineer (`generalist`)**: For running test suites (`nx test`, `nx e2e`) and fixing failures until "green."
- **Context Injection**: Every delegation request MUST include:
  - **Core Mandates**: (Supabase Native SDK, Angular 21 Signals).
  - **Design Tokens**: The "Nook" premium aesthetic rules.
  - **Architecture**: The 4-Tier Library Structure and IoC rules.
- **Result Compression**: Sub-agents must return concise summaries. The main session keeps context lean by avoiding repetitive file reads already performed by sub-agents.

## Architectural Strategy

The project uses a **4-Tier Library Structure** within the Nx workspace to enforce strict Inversion of Control (IoC):

1.  **`domain`**: Core business rules, models, and interfaces (Pure TypeScript, no dependencies). Defines `IRepository` interfaces.
2.  **`application`**: Use Cases, Commands, and Queries (Orchestration/Logic). Houses **NgRx Signal Stores**.
3.  **`data-access`**: Infrastructure implementations (Supabase SDK). Implements domain interfaces.
4.  **`feature`**: Smart Components and Routing (Injects Stores, handles business logic).
5.  **`ui`**: Dumb/Presentational components (Inputs/Outputs only, NEVER injects stores).


**Zero Shared Models**: Models reside exclusively within the `domain` tier of their respective library.

## Building and Running

### Development

_Note: All commands must be from the `bean-opt` directory._

- **Run App**; `npx nx serve bean-opt-web`
- **Supabase CLI**: Use standard `npx supabase` commands for local development

### Build and Deploy

- **Build Production**: `npm run build:prod` (builds to `dist/bean-opt/browser` or `dist/apps/...`)
- **Deploy**: Coudflare pages via Wrangler.

### Testing and Linting

- **Unit Tests**: `npx nx text <project-name>`
- **E2E Tests**: `npx nx e2e bean-opt-web-e2e`
- **Linting**: `npx nx lint <project-name>`

## Custom Generators

The project uses custom NX generators to automate the architectural boilerplate and design standards (See `libs/shared/tooling` for list of available generators like `domain-shell`, `ui-component`, etc.)

## Coding Standards and Conventions

### IoC & Dependency Injection

- **Interfaces**: Always define repository interfaces in the `domain` layer.
- **Tokens**: Provide implementations in the `wfi-mobile` shell using `InjectionTokens`.

### Supabase

- **Native SDK Only**: ALWAYS use the `@supabase/supabase-js` client via `SupabaseService`.
- **Row Level Security (RLS)**: Security is primarily enforced at the database level.

### Angular & State

- **Signals**: Use Angular Signals for all internal state.
- **Standalone**: All components, directives, and pipes must be `standalone: true`.

### UI & Styling

- **Angular Material M3**: Use Material 3 for all styling, focusing on using the environment variables provided for the themes.**
- **Tailwind CSS**: Use Tailwind Css for positioning or custom styling of the components.

## Key File Locations

- `bean-opt` Main Angular shell (sometimes located in `apps/bean-opt-web` depending on Nx version)

# MANDATORY PRE-TASK BREIF
Before beginning any implementation task in this workspace, you MUST read and acknowledge the guidelines in:
`documentation/llm-pre-task-brief.md`
This document contains the required architecture, UI tokens, and the user's Step-Wise Development workflow.

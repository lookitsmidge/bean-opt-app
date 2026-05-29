# BeanOpt Project Roadmap

This document provides a high-level overview of the project's progress, categorised by Epics, User Stories, and Subtasks.

## Status Legend

- `[x]` **Done**: Feature is fully functional (Backend + UI).
- `[/]` **In Progress / Partial**: Backend infrastructure exists, but UI or logic is incomplete.
- `[ ]` **To Do**: Not yet started or fundamentally missing.

## Architectural Foundations (Low-Cost / High-Value)

_Goal: Enterprise performance at hobbyist costs._

**User Story: High-Performance Security**
- `[x]` Implement JWT Sync trigger: to sync `user_roles` to `auth.users` app_metadata for join-free, millisecond RLS checks`

## Feature 1: Authentication & User Governance

- **User Story: Secure Sign-Up & Identity**
  - `[ ]` Implement Supabase Auth (Email/Google).
  - `[ ]` Allow email sign in and Google
  - `[ ]` Disallow anonymous sign-ins
  - `[ ]` Landing page for our page, that says about us, then allows user to log in
  - `[ ]` Legal: accessible privacy policy
  - `[ ]` Legal: Include brief T&C and Privacy Policy
- **User Story: Administrative User Management**
  - `[ ]` Admins to approve new sign-ups
  - `[ ]` Admins to delete accounts and all their data

## Core: UI and Design System

- **User Story: Modernised Shell**
  - `[ ]` Layout: Headerless design
  - `[ ]` Floating profile icon for mobile users
  - `[ ]` Responsive shop.com floating navbar for mobile and sidenav for desktop
  - `[ ]` Multiple theme systems: automatic WCAG compliance with high contrast & dark mode

## Feature: Bean Management
- **User Story: Record beans you are logging**
  - cost per cup?
  - bean brands
  - store recommended ranges for these beans and any grind size settings you have found or workflows

## Feature: Run Management (Espresso Tracking)
- **User Story: Record a run**
  - `[x]` in-built timer (fully integrated with Angular Signals stopwatch UI)
  - `[ ]` Support manual entry of extraction time (as an alternative to the interactive stopwatch timer)
  - `[ ]` double/single toggle 
  - `[x]` grams in (coffee mass logs)
  - `[x]` grams out (water yield logs)
  - `[ ]` readout and shot mapping (plot it and ask for taste feedback).

## Shot Diagnosis Tool
- **User Story: Shot Doctor diagnosis tool**
  - Help you tune your beans for your machine, accounting for many variables (to be researched) including initial heat, preinfusion and what to look for.
  - think install wizard but for coffee bean tuning

## Testing & Quality Audit (Decision Matrix)

_to be completed in time_

## Summary of Completion

- **Auth Security & RLS**: Configured JWT claim synchronisation to enable join-free RLS checks. Restricted profile accessibility to owners.
- **Readings Feature Scaffold**: Created four DDD-tiered libraries under `libs/features/readings` for espresso logging. Applied migration for the `espresso_readings` table and set up RLS policies.
- **Scaffolding Tooling Migration**: Converted the code generator workspace libraries scaffolding mechanism from Jest to Vitest (`vitest-analog`). Configured automatic explicit `@nx/vitest:test` targets generation.
- **Testing Alignment**: Successfully migrated all readings libraries, tooling project configuration files, and unit tests to Vitest. All test suites pass successfully.

## Next Session (Handoff Log)

- **Ready for UI & Shell Hooks**: All foundations, database migrations, types generation, and testing configurations are active and compiling cleanly under production configurations. The Readings Feature has a functional UI with stopwatch timer inputs, awaiting routing hookups to the main shell.

## Immediate Next Steps:

1. **Routing Shell Integration**: Link up the `READINGS_ROUTES` path to the main application navigation menu.
2. **Header Navigation & Auth Buttons**: Connect the route guards (`AuthGuard`) and configure the header navigation/auth login triggers.
3. **Bean Selection**: Integrate coffee bean selection within the espresso logging readings panel.

## Backlog:

- **Espresso Readings Enhancements**:
  - Allow user to select which coffee bean they used for the extraction.
  - Allow user to configure their setup, add multiple setups, and select a setup when performing a reading (defaulting to the last one used).
  - Allow user to rate their espresso shot out of 5 stars.
  - Allow user to rate shot extraction quality via a sliding acidity/burned scale (under-extracted - gold zone - over-extracted).
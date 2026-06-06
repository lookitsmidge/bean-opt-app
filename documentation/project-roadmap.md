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

- **Espresso Readings & Lap Timer Enhancements**:
  - `[ ]` Integrate pre-infusion and extraction lap timer in stopwatch UI
  - `[ ]` Allow user to select coffee bean used for extraction (referencing `coffees` table)
  - `[ ]` Allow user to select equipment setup used for extraction (referencing `setups` table, defaulting to last one used)
  - `[ ]` Support star rating (0-5 stars)
  - `[ ]` Support flavor balance rating slider (1-10 range for under-extracted, balanced, over-extracted)
  
- **Bean Management Features**:
  - `[ ]` Database migration and UI elements for logging beans (brands, roaster, roastery, roast date, remaining bag weight, bag photo/upload, shopping URLs/links)
  - `[ ]` Create database schema and UI elements for coffee target ranges (specifying upper/lower bounds for yields, extraction times, and flow rates)
  
- **Workflow Management Features**:
  - `[ ]` Database migration and UI elements to add/edit workflows and their steps (ordered sequence with 'Stage: Before | During | After', content, and 'Important' highlighting flag)

- **Equipment & Setup Management Features**:
  - `[ ]` Database migrations and UI elements to add/edit setups, coffee machines, coffee grinders, and custom equipment (portafilters, baskets, shakers, WDT)
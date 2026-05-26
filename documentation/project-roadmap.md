# BeanOpt Project Roadmap

This document provides a high-level overview of the project's progress, categorised by Epics, User Stories, and Subtasks.

## Status Legend

- `[x]` **Done**: Feature is fully functional (Backend + UI).
- `[/]` **In Progress / Partial**: Backend infrastructure exists, but UI or logic is incomplete.
- `[ ]` **To Do**: Not yet started or fundamentally missing.

## Architectural Foundations (Low-Cost / High-Value)

_Goal: Enterprise performance at hobbyist costs._

**User Story: High-Performance Security**
- `[/]` Implement JWT Sync trigger: to sync `user_roles` to `auth.users` app_metadata for join-free, millisecond RLS checks`

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

## Feature: Run Management
- **User Story: Record a run**
  - in-built timer
  - double/single toggle 
  - grams in 
  - grams out 
  - readout and shot mapping (plot it and ask for taste feedback).

## Shot Diagnosis Tool
- **User Story: Shot Doctor diagnosis tool**
  - Help you tune your beans for your machine, accounting for many variables (to be researched) including initial heat, preinfusion and what to look for.
  - think install wizard but for coffee bean tuning

## Testing & Quality Audit (Decision Matrix)

_to be completed in time_

## Summary of Completion

_to be completed in time_

## Next Session (Handoff Log)

- **Auth Schema & Library Refactoring Completed**: Database schema was simplified to remove deprecated columns (`visibility`, `is_verified`, `subscription_tier`, `social_links`). JWT role check helper functions (`public.authorize`, `public.is_admin`, `public.is_moderator`) were implemented, and RLS policies on `profiles` were simplified to be owner-restricted. Frontend auth libraries were updated, and all 91 unit tests are passing.

## Immediate Next Steps:

1. **Apply DB Migrations**: Run `npx supabase db reset` to apply the migrations to the local Supabase container.
2. **Connect Auth Library to Application**: Register `SupabaseAuthRepository` and `SupabaseProfileRepository` (from `@boa/core-auth-data-access`) in `app.config.ts`.
3. **Route Protection**: Implement and configure the Route Guards (`AuthGuard`) to restrict unauthenticated access to the Home/Landing page only.
4. **Header Navigation & Auth Buttons**: Implement the "Log In" trigger component in place of the floating profile icon when a user is not authenticated.

## Backlog: (to be split out)
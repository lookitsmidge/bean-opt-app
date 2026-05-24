# BeanOpt Project Roadmap

This document provides a high-level overview of the project's progress, categorised by Epics, User Stories, and Subtasks.

## Status Legend

- `[x]` **Done**: Feature is fully functional (Backend + UI).
- `[/]` **In Progress / Partial**: Backend infrastructure exists, but UI or logic is incomplete.
- `[ ]` **To Do**: Not yet started or fundamentally missing.

## Architectural Foundations (Low-Cost / High-Value)

_Goal: Enterprise performance at hobbyist costs._

**User Story: High-Performance Security**
- `[ ]` Implement JWT Sync trigger: to sync `user_roles` to `auth.users` app_metadata for join-free, millisecond RLS checks`

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

- **Title here**: description here


## Immediate Next Steps:

1. **Name here**: description here


## Backlog: (to be split out)
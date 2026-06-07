# BeanOpt Project Roadmap

This document provides a high-level overview of the project's progress, categorised by Epics, User Stories, and Subtasks.

## Status Legend

- `[x]` **Done**: Feature is fully functional (Backend + UI).
- `[/]` **In Progress / Partial**: Backend infrastructure exists, but UI or logic is incomplete.
- `[ ]` **To Do**: Not yet started or fundamentally missing.

---

## Architectural Foundations

_Goal: Enterprise performance at hobbyist costs._

- `[x]` **JWT Sync trigger**: Sync `user_roles` to `auth.users` app_metadata for join-free, millisecond RLS checks.
- `[x]` **Scaffolding Tooling Migration**: Migrated all monorepo libraries and scaffolding tooling from Jest to Vitest (`vitest-analog`) to align test execution speeds.

---

## Completed Features

### Feature: Espresso Track & Run Management (Stopwatch & Logs)
- `[x]` **Stopwatch Timer**: Integrated Angular Signals-based stopwatch tracking pre-infusion and extraction timings.
- `[x]` **Pre-infusion & Extraction Lap Split**: Stopwatch supports lap split to correctly segment pre-infusion from main extraction.
- `[x]` **Manual Timing Entries**: Supports entering and editing timings manually when the stopwatch is idle (for logging historic extractions).
- `[x]` **Mass Input/Output Logs**: Input grams (coffee dose) and output grams (beverage yield).
- `[x]` **Flavor Balance & Shot Quality Ratings**: Embedded 1-10 flavor balance slider (Under-extracted/Gold Zone/Over-extracted) and a 0-5 star shot quality rating system with a bright glowing active style.
- `[x]` **Reading Edits**: Full edit mode supporting loading past readings, retaining original timestamps, and performing database updates cleanly without duplicating state.
- `[x]` **Advanced Defaults Orchestration**:
  - Brand new logs auto-populate selected coffee, setup, workflow, warming shot, dose, and yield from the overall most recent reading.
  - Changing the selected coffee bean reactively updates form parameters (setup, workflow, warming shot, dose, and yield) to match the last shot logged for that specific bean.
  - Defaults are safely bypassed in edit mode (`!isEditMode()`) to prevent overwriting modified data.

### Feature: Bean Management
- `[x]` **Hopper Registry**: Register and archive beans including brand, roaster, notes, price, and active hopper status.
- `[x]` **Extraction Target Profiles**: Mapped nested target profile ranges (Min/Max pre-infusion, Min/Max extraction time, Yield, and Flow-Rate) directly linked to target taste profiles (e.g. "Sweet & Fruity") under each coffee bean.
- `[x]` **Targets Display**: Displays target specifications for the selected coffee bean dynamically and reactively on the Record/Edit Shot log page.

### Feature: Equipment & Setup Management
- `[x]` **Entities Refactor**: Replaced legacy model/year/type fields under Coffee Machines and Grinders with a unified `manufacturer` description.
- `[x]` **Setup Configurator**: Combine active machines, grinders, and custom tools (baskets, portafilters, shakers) into functional setups.
- `[x]` **Modern Angular Controls**: Converted all equipment templates to use Angular 17+ block syntax (`@if`, `@for`).

### Feature: Workflow Management
- `[x]` **Structured Steps**: Refactored workflow steps to replace the unstructured text content field with explicit `title` and `instructions` fields.
- `[x]` **Visual Checklist**: Workflows render step sequences with title headings and instructions displayed dynamically in ordered sequence cards.

---

## Remaining Backlog & Future Tasks

### Feature 1: Authentication & User Governance
- `[ ]` **Sign-In Options**: Configure email sign-up/sign-in and Google OAuth login flows.
- `[ ]` **Access Controls**: Disable anonymous access and enforce admin validation check for new user approvals.
- `[ ]` **Landing Page**: Build custom landing page introducing BeanOpt with an entry gateway.
- `[ ]` **Legal & Privacy**: Draft accessible Terms & Conditions and Privacy Policy.
- `[ ]` **Account Offboarding**: Implement account deletion trigger cascade to wipe all associated database logs.

### Core: UI and Design System
- `[ ]` **Modernised Shell Layout**: Move to headerless workspace layouts.
- `[ ]` **Mobile Optimisations**: Add floating profile settings panel and reactive mobile navigation bar.
- `[ ]` **WCAG Themes**: Fully automated high contrast, light, and dark accessibility themes.

### Diagnostics & Shot Analysis
- `[ ]` **Shot Diagnosis Tool (Shot Doctor)**:
  - Step-wise installation wizard mapping extraction parameters (yield, timings, flow rate, flavor balance) against troubleshooting decision trees.
  - Suggest corrective adjustments (grind coarser/finer, adjust temperature, change pre-infusion) to resolve sourness or bitterness.
- `[ ]` **Shot Charts & Mapping**:
  - Render extraction graphs (flow rate, yield progression curves) and interactive analytics.
  - Double/Single basket filter toggle logs.
- `[ ]` **Follow Workflow Assistance**:
  - Add option to view and follow step-by-step instructions of the selected workflow during an active shot extraction session.

### Custom Equipment & Setup Assignment
- `[x]` **Custom Equipment UI**:
  - Build UI views/dialogs for registering custom equipment (e.g. *IMS High Flow Rate Basket*, *Normcore Shaker*, *Normcore V4 Tamper*, *Normcore Bottomless Portafilter*) into the `coffee_equipments` database table.
  - Build UI controls inside the setup configurator to associate these tools to specific configuration setups using the `setup_equipments` database link-table.

### Database & Seed Management
- `[ ]` **Seed Data Scripts**:
  - Add SQL seed scripts to populate default configurations for workflows, machines, grinders, and beans so that they are automatically available upon deployment.

---

## Summary of Completion & Milestones

1. **Phase 1-2: Auth & Scaffold**: Synchronized JWT auth metadata with Postgres roles. Created and tested the core readings library tiers using Vitest.
2. **Phase 3-4: Equipment & Workflows**: Refactored machine and grinder attributes to highlight manufacturers, and structured workflow steps with headings/instructions.
3. **Phase 5-6: Stopwatch & Extraction Targets**: Resolved stopwatch lap splitting bugs, added multiple target profile definitions per coffee, and cascade saved target ranges.
4. **Phase 7-8: Pre-infusion Targets & Manual Timers**: Added support for pre-infusion targets in coffee forms, clarified flow-rate metrics apply strictly to extraction, and added manual input support for timing segments.
5. **Phase 9: Reading Edits & Advanced Defaults**: Completed edit page mapping, overall last shot defaults, bean-specific parameter default overrides on dropdown changes, targets display box on log page, and enhanced glowing active stars layout.
6. **Phase 11: Custom Equipment & Setup Assignment**: Added domain models, data repository, and SignalStore for custom accessories. Integrated tools multiselect inside the setup configurations form and displayed assigned accessories as chips on setups cards.

## Next Session Focus
- **Follow Workflow Assistance**: Build UI controls in log/edit page to view and walk through ordered workflow instructions during an active timing session.
- **Shot Diagnosis (Shot Doctor)**: Integrate corrective algorithm wizards based on taste and time outcomes.
- **Database Seeding**: Write Postgres seed files to automate initial database installations.
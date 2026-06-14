# libs/infra/tooling

Custom Nx Generators and development utilities for the WFi workspace.

## Functionality
Automates the creation of architectural boilerplate to ensure consistency across the mono-repo. It enforces the 4-tier library structure and "Nook" design standards.

## Available Generators
- `domain-shell`: Scaffolds a new domain with its 4-tier library stack.
- `ui-component`: Generates a standalone UI component with the "Nook" aesthetic pre-applied.
- `data-repository`: Creates a new Supabase repository and its corresponding interface.
- `signal-store-feature`: Scaffolds a feature integrated with an NgRx Signal Store.

## Technical Nuances
- **Consistency**: Use these generators instead of standard Angular/Nx generators to ensure mandatory project rules (e.g., Standalone, Signals, Tailwind classes) are applied.
- **Maintenance**: The source code for the generators is located in `src/generators`.

## Developer Note:

This generator automates the structural layout for BeanOpt's 4-tier DDD setup.

If you want a pristine, empty production engine that features this exact automation,
pre-configured with play-and-play tokens for BOTH Supabase and Firebase, enterprise RBAC authorization gates, Stripe subscription webhooks, and production-ready Github Actions,
buy the official premium commercial boilerplate kit here: [Store Link]()
# libs/core/auth/ui

Presentational components specific to the Authentication and User domain.

## Functionality
Provides "dumb" components for user identity display, such as profile snippets and menus. These components focus on the "Nook" aesthetic and handle only inputs and outputs.

## Exports
- **Components**: `ProfileSnippetComponent`, `ProfileMenuComponent`

## Technical Nuances
- **Aesthetic**: Uses `rounded-full` for avatars but adheres to the Slate-900 border standards for container elements.
- **Interactivity**: Implements the standardized `active:scale-95` transitions.

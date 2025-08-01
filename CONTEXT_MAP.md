# Project Context and Resource Map

This document provides a quick reference for where to find key files, tables, and resources in the project. Update this as the project evolves.

## File Structure Overview

- `src/components/` - UI, authentication, game, and layout components
- `src/lib/`        - Authentication config, database utilities, general and security utilities
- `src/pages/`      - API routes, authentication pages, game pages
- `src/styles/`     - Global styles (murim theme)
- `src/types/`      - TypeScript type definitions

## Database Table Log

| Table Name      | Purpose                                 |
|-----------------|-----------------------------------------|
| users           | Stores user accounts and anti-duplicate |
| user_devices    | Tracks devices for duplicate prevention |
| login_attempts  | Tracks login attempts for rate limiting |

Update this table as new tables are added.

## Key Resources


## Environment Variables

See `.env.local` for all required secrets and configuration.

## Code Explanation Policy

All code in this project must include a comment or markdown explanation describing its purpose and reasoning.

---
| src/styles/globals.css        | Global styles for murim theme, Tailwind base, custom backgrounds, and animations |
| src/pages/HomePage.tsx        | Main homepage component with murim theme, animated backgrounds, and entry to authentication |
Keep this document up to date as the project grows.

# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the app code.
- `src/components/` holds UI components such as `Pad`, `PadGrid`, and modal/menu controls.
- `src/store/` contains Zustand state modules (`padStore.ts`, `howlerStore.ts`).
- `src/types/` defines shared TypeScript types.
- `public/` stores static assets and PWA files (`sw.js`, icons, sample zip).
- `docs/plan/` tracks implementation notes and change plans.
- `dist/` and `dev-dist/` are build artifacts; do not edit manually.

## Build, Test, and Development Commands
- `npm install` installs dependencies for local development.
- `npm run dev` starts Vite dev server.
- `npm run build` creates a production bundle in `dist/`.
- `npm run preview` serves the production build locally for verification.
- `npm run lint` runs ESLint (currently minimal config).
- `npm run deploy` builds and publishes `dist/` via `gh-pages`.

## Coding Style & Naming Conventions
- Language stack: TypeScript + React function components.
- Indentation: 2 spaces; keep imports grouped and sorted consistently.
- Components and types: `PascalCase` (e.g., `AddPadModal`, `Pad`).
- Variables/functions/hooks: `camelCase` (e.g., `usePadStore`, `handleDrop`).
- Store files follow `*Store.ts` naming; shared types live in `src/types/`.
- Run `npm run lint` before opening a PR.

## Testing Guidelines
- No automated test framework is configured yet.
- For now, validate changes with:
  - `npm run build` (must succeed)
  - `npm run preview` and manual checks for add/reorder/delete/play flows
- When adding tests, prefer colocated `*.test.ts(x)` files under `src/`.

## Commit & Pull Request Guidelines
- Follow Conventional Commit-style prefixes seen in history: `feat:`, `fix:`, `style:`, `chore:`.
- Keep commits focused and descriptive (example: `fix: prevent repeated-click border flicker`).
- PRs should include:
  - clear summary of behavior changes
  - linked issue(s) when applicable
  - screenshots or short recordings for UI changes
  - verification steps (commands run, manual scenarios tested)

## Security & Configuration Tips
- Do not commit secrets; this project deploys through GitHub Actions.
- Keep static assets in `public/` and avoid oversized media blobs.
- Ensure PWA-related files (`public/sw.js`, manifest assets) stay in sync with build output.

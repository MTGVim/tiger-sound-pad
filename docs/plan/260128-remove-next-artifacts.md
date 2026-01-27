Title: Remove Next.js artifacts and consolidate React/Vite app

Meta:
- Date: 260128
- Repo: tiger-sound-pad
- Personal tracker (optional): N/A

Goal:
- Cleanly remove leftover Next.js files/config and ensure the React/Vite app in `src` is the single source of truth.

Non-goals:
- Changing existing business logic for pads or audio beyond necessary import/path fixes.
- Introducing new UI features unrelated to migration.

Assumptions / Constraints:
- Tech stack: React with Vite, Zustand, DnD Kit, Howler.
- Environment: local development via `vite` dev server.
- All runtime code should live under `src`, with no dependencies on `app` or Next-specific packages.

Implementation:
- [ ] Identify all Next.js-specific files and duplicated components/stores between `app` and `src`.
- [ ] Move any required shared components (e.g. modals) into `src` and update imports to stop referencing `app`.
- [ ] Remove `app` directory and `next.config.ts`, and align docs to describe Vite/React usage.

Verification:
- [ ] Tests
- [ ] Manual checks
- [ ] Commands executed (record exact commands and results)

Docs updates:
- [ ] README.md
- [ ] CLAUDE.md (repo-level)
- [ ] Other docs (specify)

Rollback:
- Restore removed files via git if needed (`git restore` or `git checkout` on specific paths).
- Revert to previous commit to bring back Next.js structure if Vite-only setup causes issues.

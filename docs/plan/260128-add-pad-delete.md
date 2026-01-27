Title: Add pad delete via trash dropzone

Meta:
- Date: 260128
- Repo: tiger-sound-pad
- Personal tracker (optional): N/A

Goal:
- Allow users to delete pads via a trash icon (click-to-delete flow) and ensure all persisted data (including IndexedDB audio blobs) is removed.

Non-goals:
- Redesigning the overall layout or changing existing drag-and-drop behavior beyond what is needed for delete.
- Implementing multi-select or bulk delete flows.

Assumptions / Constraints:
- Tech stack: React with Vite, Zustand, DnD Kit, Howler, idb-keyval.
- Environment: local development; production behavior should match without additional env-specific flags.
- IndexedDB is used for audio blobs and must be cleaned up when a pad is deleted.
- No usage of the `any` type; reuse existing Pad-related types.

Implementation:
- [x] Add a trash icon button in the top-right area of the main app to toggle delete mode.
- [x] In delete mode, clicking a pad shows a browser confirm dialog before deletion (no drag-to-delete).
- [x] On confirm, remove the pad from the Zustand store and delete any associated IndexedDB audio blob.

Verification:
- [ ] Tests
- [x] Manual checks
- [x] Commands executed (record exact commands and results)

Docs updates:
- [x] README.md
- [ ] CLAUDE.md (repo-level)
- [ ] Other docs (specify)

Rollback:
- Revert changed files with git (`git restore` or `git reset --hard` if local-only).
- If IndexedDB cleanup causes issues, temporarily disable blob deletion while keeping pad removal logic, then revisit.


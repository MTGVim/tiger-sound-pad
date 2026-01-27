Title: Fix mp3 upload and IndexedDB persistence

Meta:
- Date: 260128
- Repo: tiger-sound-pad
- Personal tracker (optional): N/A

Goal:
- Ensure mp3 files uploaded for pads are saved to IndexedDB and correctly loaded/played after refresh.

Non-goals:
- Major UI redesign beyond what is necessary to support mp3 upload and playback.
- Changing existing state management libraries or core architecture.

Assumptions / Constraints:
- Tech stack: React, Vite/Next environment with Zustand store.
- Environment: Focus on local development; production behavior should match but is not separately deployed yet.
- IndexedDB is used to store audio blobs and must not use any `any` type.
- Performance should be acceptable for a small number of mp3 files (dozens, not thousands).

Implementation:
- [x] Review current pad store, IndexedDB usage, and upload flow for mp3 files.
- [x] Fix or implement IndexedDB save/load logic so uploaded mp3 files persist and are bound to pads.
- [x] Wire UI (upload, pad click) to use loaded blobs/URLs from IndexedDB correctly.

Verification:
- [ ] Tests
- [x] Manual checks
- [x] Commands executed (record exact commands and results)

Commands executed:
- npm run build

Docs updates:
- [ ] README.md
- [ ] CLAUDE.md (repo-level)
- [ ] Other docs (specify)

Rollback:
- Revert changed files using git (`git restore <files>` or `git reset --hard` if local-only changes).
- Remove any new IndexedDB stores or schema changes if they cause issues, and fall back to previous localStorage-based behavior.

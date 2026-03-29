# Tasks Document

- [x] 1. Add Playwright tooling and standardize npm-based test commands
  - File: package.json
  - File: playwright.config.ts
  - File: package-lock.json
  - Add Playwright dependencies and repository scripts for local install, browser install, and E2E execution.
  - Create a Playwright runner configuration that uses the built app via `vite preview`, includes the GitHub Pages base path, and captures useful CI artifacts.
  - Commit the npm lockfile so local and CI automation use the same package manager assumptions.
  - Purpose: Establish a single local/CI Playwright entrypoint aligned with the existing Vite build and GitHub Pages base path.
  - _Leverage: package.json, vite.config.ts, README.md_
  - _Requirements: 1.1, 1.2, 3.2, 3.3, 4.2, 5.1_
  - _Prompt: Implement the task for spec playwright-ci-cd-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend infrastructure engineer specializing in Playwright and Vite automation | Task: Update the repository tooling so Playwright can run locally and in CI against a production-like preview server, and standardize the automation path on npm with a committed package-lock.json | Restrictions: Do not change the app's product behavior, do not remove the existing Vite base-path behavior, and do not introduce an additional custom server when `vite preview` can be reused | _Leverage: reuse the existing `build` and `preview` scripts, current `vite.config.ts` base path, and the repository's npm-based developer guidance | _Requirements: 1.1, 1.2, 3.2, 3.3, 4.2, 5.1 | Success: Playwright config compiles, scripts clearly support local setup and execution, preview-backed test runs target the correct base URL, and the repository now has a consistent npm lockfile/toolchain story | Workflow: Before coding, mark this task as `[-]` in tasks.md. After implementation and verification, run `log-implementation` with detailed artifacts, then mark the task as `[x]` in tasks.md._

- [x] 2. Add stable test hooks to the existing UI for reliable browser automation
  - File: src/components/TopMenu.tsx
  - File: src/components/AddPadModal.tsx
  - File: src/components/Pad.tsx
  - Add stable, explicit selectors and accessibility-friendly hooks for the add, delete, reorder, stop, modal, and pad interaction surfaces.
  - Expose a reliable UI-visible signal for playback state so the E2E suite can verify play interactions without depending on actual audio hardware output.
  - Keep the changes minimal and local to existing components.
  - Purpose: Make browser-driven tests stable without coupling them to styling-only selectors or fragile DOM order.
  - _Leverage: src/App.tsx, src/components/PadGrid.tsx, src/components/SortablePad.tsx, src/store/howlerStore.ts_
  - _Requirements: 1.3, 5.1, 5.2_
  - _Prompt: Implement the task for spec playwright-ci-cd-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React developer focused on testability and accessible interaction surfaces | Task: Add stable test hooks to the current menu, modal, and pad components so Playwright can drive the real UI for add, delete, reorder, and play flows, including a reliable playback-state signal | Restrictions: Do not redesign the UI, do not add test-only runtime state containers, and do not depend on class names or visual ordering alone as selector contracts | _Leverage: follow the current component boundaries in `TopMenu.tsx`, `AddPadModal.tsx`, `Pad.tsx`, and preserve existing app/store wiring | _Requirements: 1.3, 5.1, 5.2 | Success: Core controls and pads have stable selectors or accessible names, playback state is assertable in tests, and existing user behavior remains unchanged | Workflow: Before coding, mark this task as `[-]` in tasks.md. After implementation and verification, run `log-implementation` with detailed artifacts, then mark the task as `[x]` in tasks.md._

- [x] 3. Create the initial Playwright support layer and end-to-end regression suite
  - File: tests/e2e/helpers.ts
  - File: tests/e2e/app.spec.ts
  - File: tests/e2e/reorder.spec.ts
  - Create reusable helpers for navigation, dialog handling, selector access, and any shared setup needed by the suite.
  - Add smoke and regression coverage for app load, add pad, delete pad, playback interaction, and reorder behavior.
  - Keep the suite focused on Chromium and critical user journeys so it remains practical for every CI run.
  - Purpose: Deliver the first maintainable E2E suite that exercises the app through the same UI users see.
  - _Leverage: playwright.config.ts, src/components/TopMenu.tsx, src/components/AddPadModal.tsx, src/components/Pad.tsx, src/components/PadGrid.tsx_
  - _Requirements: 1.2, 1.3, 2.1, 2.2, 4.1, 4.3, 5.1_
  - _Prompt: Implement the task for spec playwright-ci-cd-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA automation engineer specializing in Playwright-based browser regression suites | Task: Build the initial Playwright support files and E2E specs that cover the approved smoke and regression scenarios against the real Tiger Sound Pad UI | Restrictions: Do not test implementation details below the browser surface, do not create oversized monolithic spec files without shared helpers, and do not expand browser coverage beyond the minimum Chromium path for the first iteration | _Leverage: use the stable selectors introduced by the UI task, the preview-backed Playwright config, and the existing add/delete/reorder/play app flows | _Requirements: 1.2, 1.3, 2.1, 2.2, 4.1, 4.3, 5.1 | Success: The suite runs locally, key user journeys are covered, helper code is reusable, and failed runs preserve diagnostics through the configured Playwright artifacts | Workflow: Before coding, mark this task as `[-]` in tasks.md. After implementation and verification, run `log-implementation` with detailed artifacts, then mark the task as `[x]` in tasks.md._

- [x] 4. Gate GitHub Pages deployment on Playwright validation in GitHub Actions
  - File: .github/workflows/deploy.yaml
  - Update the deployment workflow so it installs dependencies with npm, builds the app, installs Playwright browsers, runs the E2E suite, uploads reports/artifacts, and only deploys if the validation job succeeds.
  - Preserve the existing GitHub Pages deployment target while fixing the current mismatch between local npm usage and workflow yarn usage.
  - Purpose: Ensure production deployments only publish artifacts that already passed automated browser validation.
  - _Leverage: .github/workflows/deploy.yaml, package.json, playwright.config.ts_
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.3_
  - _Prompt: Implement the task for spec playwright-ci-cd-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: CI/CD engineer specializing in GitHub Actions and static-site deployment pipelines | Task: Restructure the existing deployment workflow so Playwright validation is a required gate before GitHub Pages publishing, while also normalizing the job to the repository's npm-based toolchain | Restrictions: Do not bypass failed Playwright runs, do not remove artifact retention for failures, and do not break the repository's current GitHub Pages hosting path or deployment trigger semantics unless required by the approved design | _Leverage: extend the existing `deploy.yaml`, reuse repository scripts from `package.json`, and use artifact/report paths defined in `playwright.config.ts` | _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.3 | Success: Pull request or main-branch validation runs Playwright against a built artifact, deploy is blocked on failure, npm is used consistently, and GitHub Actions uploads useful diagnostics | Workflow: Before coding, mark this task as `[-]` in tasks.md. After implementation and verification, run `log-implementation` with detailed artifacts, then mark the task as `[x]` in tasks.md._

- [x] 5. Document the Playwright workflow for local development and CI debugging
  - File: README.md
  - Update the README with Playwright install/run commands, CI/CD behavior, artifact/report locations, and any contributor notes needed to understand the new workflow.
  - Reflect the final deployment pipeline so the repository documentation no longer describes a yarn-based Action if npm is the actual toolchain.
  - Purpose: Make the new test and deployment behavior discoverable for future contributors.
  - _Leverage: README.md, package.json, .github/workflows/deploy.yaml, playwright.config.ts_
  - _Requirements: 3.3, 4.3, 5.3_
  - _Prompt: Implement the task for spec playwright-ci-cd-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical writer with frontend tooling experience | Task: Update the project documentation so contributors know how to install and run Playwright locally, understand how CI gates deployment, and know where to inspect Playwright artifacts when failures occur | Restrictions: Do not leave stale yarn-specific instructions once npm is standardized, do not omit CI artifact/report guidance, and keep the README aligned with the actual implemented commands and workflow names | _Leverage: reuse the final scripts from `package.json`, workflow behavior from `.github/workflows/deploy.yaml`, and artifact conventions from `playwright.config.ts` | _Requirements: 3.3, 4.3, 5.3 | Success: The README accurately documents the local setup, CI gating, and debugging flow, with no contradiction between docs and implementation | Workflow: Before coding, mark this task as `[-]` in tasks.md. After implementation and verification, run `log-implementation` with detailed artifacts, then mark the task as `[x]` in tasks.md._

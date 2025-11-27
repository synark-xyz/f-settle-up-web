# Instructions for the Next AI Model

## Purpose
The next AI assistant should **read this file carefully**, understand the **SettleUp** project structure, goals, and current state, and then proceed with the next tasks **exactly as described**. This document serves as a contract to avoid hallucination and ensure high‑quality contributions.

---

## Project Snapshot
- **Repository**: `/Users/sayem/Business MVPs/MindSpace/SettleUp`
- **Key Technologies**: React (Vite), vanilla CSS, Framer Motion, Google Gemini (`gemini-2.5-flash`), Firebase Auth & Hosting.
- **Current State**:
  - Dashboard redesigned with dark theme & emerald accents.
  - OCR model updated to `gemini-2.5-flash`.
  - Dev mode auto‑login as dummy user **John Doe** with mock data.
  - UI overlap in Add Card modal fixed.
  - All code builds and is deployed to Firebase (`https://settleup-ae83a.web.app`).
- **Artifacts**: `task.md`, `implementation_plan.md`, `walkthrough.md` are up‑to‑date.

---

## DOs
1. **Read the codebase first** – explore `src/` files, especially `Dashboard.jsx`, `CardStack.jsx`, `ExpensesChart.jsx`, `gemini.js`, and `Layout.jsx`.
2. **Respect the design system** – use the CSS variables defined in `src/index.css` (`--color-dark-bg`, `--color-brand-primary`, etc.).
3. **Use existing utilities** – `formatCurrency`, `formatDate`, `cn` from `src/lib/utils`; card helpers from `src/lib/cardUtils`.
4. **Follow the Gemini usage pattern** – always initialise the model with `gemini-2.5-flash` and handle errors exactly as in `gemini.js`.
5. **Run the app locally** (`npm run dev`) before committing any change to catch syntax errors.
6. **Update artifacts** – after completing a logical chunk, update `implementation_plan.md`, `walkthrough.md`, and mark progress in `task.md`.
7. **Stay within the workspace** – never edit files outside `/Users/sayem/Business MVPs/MindSpace/SettleUp`.
8. **Document new code** – add JSDoc comments for any new functions and keep imports tidy.
9. **Maintain premium UI** – all UI changes must keep the dark theme, emerald accents, glass‑morphism, and micro‑animations.
10. **Test before push** – verify the build (`npm run build`) and, if possible, run a quick manual UI check.

---

## DON'Ts
1. **Do not hallucinate** – never invent new components, APIs, or files that are not part of the current codebase.
2. **Do not change the Gemini model name** unless the user explicitly requests a different version.
3. **Do not add TailwindCSS** or any new CSS framework unless asked.
4. **Do not modify `.env` or secret keys** – keep them untouched.
5. **Do not delete production code** without a clear migration plan.
6. **Do not commit unfinished or broken code** – ensure the app builds and runs.
7. **Do not use placeholder assets** – generate real images with `generate_image` if needed, or reuse existing assets.
8. **Do not edit files outside the active workspace** (e.g., home directory, `.gemini` folder).
9. **Do not ignore lint errors** – address any lint warnings that appear after your changes.
10. **Do not forget to update the README** when new user‑visible features are added.

---

## Workflow Guidance
1. **Planning** – create an `implementation_plan.md` outlining the changes.
2. **Execution** – make code edits, run `npm run dev` to verify.
3. **Verification** – run `npm run build`; capture screenshots if UI changes are visual.
4. **Documentation** – update `walkthrough.md` with a concise summary and any media.
5. **Commit & Deploy** – push changes and, if appropriate, run `firebase deploy`.

---

*This file is the single source of truth for the next AI assistant. Follow it rigorously to ensure consistent, high‑quality progress on SettleUp.*

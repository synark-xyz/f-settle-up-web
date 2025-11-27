# Changelog

All notable changes to the **SettleUp** project are documented in this file.

## [2025-11-27] - Release

- **Dashboard Redesign**: Implemented a sophisticated dark theme with deep slate/gray backgrounds and vibrant emerald green accents. Updated layout to a minimalist premium design.
- **OCR Model Update**: Switched to `gemini-2.5-flash` for improved card scanning accuracy.
- **UI Overlap Fix**: Resolved overlapping fields in the "Add Card" modal and improved responsive grid.
- **Dev Mode Refinement**: Bypassed login in development mode, auto‑sign‑in as dummy user "John Doe" and limited mock data to this user only.
- **Card Stack Enhancements**: Updated styles for empty state, added dark theme colors, and refined hover/tap interactions.
- **Layout Header Update**: Modernized header with minimalistic design, dark background, and brand gradient button.
- **Expenses Chart Styling**: Updated chart colors to emerald palette, improved tooltip and legend styling for dark mode.
- **Deployment**: Built and deployed the updated application to Firebase Hosting (`https://settleup-ae83a.web.app`).

## [Previous]

- Fixed Card Scan OCR 404 error by using correct Gemini model.
- Added mock data handling and refined authentication flow.
- Implemented iPad frame wrapper for tablet simulation.
- Various UI polish and animation improvements.

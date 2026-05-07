# Typing Speed Test

A modern typing speed test built with React, Vite, and Tailwind CSS. The app runs fully on the frontend and includes predefined passages, custom passages, a selectable timer, live WPM and accuracy, real-time character highlighting, completion tracking, dark mode, and a final results modal.

## Features

- 10 predefined passages stored locally in `src/data/passages.js`
- Custom passage support with automatic reset when content changes
- Timer presets: `30 sec`, `1 min`, `2 min`, `5 min`, `10 min`
- Timer starts on the first keystroke and stops automatically when time ends
- Real-time feedback for correct, incorrect, pending, and current characters
- Live WPM, accuracy, character count, errors, remaining time, and completion percentage
- Restart action and keyboard shortcuts:
  - `Escape` resets the current session
  - `Ctrl/Cmd + Enter` focuses the typing area
- Dark mode toggle with local preference persistence

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Folder Structure

```text
src/
  components/
  data/
  hooks/
  pages/
  utils/
```

## Architecture Notes

- `src/pages/TypingTestPage.jsx`
  - Composes the full screen layout and connects UI components to the typing hook.
- `src/hooks/useTypingTest.js`
  - Owns session state, timer lifecycle, passage switching, restart behavior, and typing updates.
- `src/utils/textComparison.js`
  - Centralizes the real-time comparison logic and derives all typing stats from the latest input.
- `src/components/*`
  - Keeps UI concerns modular and reusable instead of placing everything in one large component.
- `src/hooks/useTheme.js`
  - Handles dark mode and persists the user preference in `localStorage`.

## Typing Metrics

- `WPM = typed_characters / 5 / minutes`
- `Accuracy = correct_characters / total_typed_characters * 100`

## Production Practices Used

- Reusable, memoized presentational components for cleaner rendering boundaries
- Isolated utilities for calculations and formatting
- Single responsibility hook for session logic
- Frontend-only architecture with no backend, auth, or database dependency
- Responsive layout with light and dark themes

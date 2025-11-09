# GitHub Copilot Instructions for TravailLog

## Project Overview

TravailLog is a Next.js-based work hours tracking application with **zero server-side storage**. All data is stored locally in the browser's localStorage, ensuring complete user privacy and data ownership.

## Technology Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript with strict mode enabled
- **UI Framework**: React 19.2.0
- **Styling**: Tailwind CSS v4 with dark mode support
- **Storage**: Browser localStorage (client-side only)
- **Build Tool**: Next.js with Turbopack

## Project Architecture

### Client-Side Only Application

- All components use `"use client"` directive
- No server-side rendering or API routes
- No backend, database, or external API calls
- All state management is handled through React hooks and localStorage

### Key Components

1. **page.tsx**: Main entry point, handles month navigation, import/export, and statistics display
2. **Calendar.tsx**: Renders calendar grid, manages day/shift interactions
3. **useLocalStorage.ts**: Custom hook for localStorage persistence
4. **types.ts**: TypeScript interfaces for Shift, DayData, WorkLog, and MonthStats
5. **utils.ts**: Utility functions for date calculations and statistics
6. **LanguageContext.tsx**: i18n support for multilingual interface
7. **translations.ts**: Translation strings for supported languages

### Data Model

```typescript
interface Shift {
  id: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  pauseMinutes: number;
}

interface DayData {
  date: string; // YYYY-MM-DD format
  shifts: Shift[];
}

interface WorkLog {
  [key: string]: DayData; // key is YYYY-MM-DD
}
```

## Development Workflow

### Build Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npx eslint .
```

### Testing

- Currently no automated tests are configured
- Manual testing involves running the development server and testing features in the browser

## Code Style and Conventions

### TypeScript

- **Strict mode** is enabled
- Use explicit type annotations for function parameters and return types
- Prefer interfaces over types for object shapes
- Use `React.FC` or explicit typing for component props

### React

- All components are client components (`"use client"`)
- Use functional components with hooks
- Prefer `useState` for component-level state
- Use custom hooks (like `useLocalStorage`) for reusable logic
- Follow React 19 best practices

### Styling

- Use Tailwind CSS utility classes
- Support both light and dark modes with `dark:` prefix
- Responsive design with mobile-first approach
- Use semantic color classes (blue for primary, green for success, etc.)

### File Organization

- All application code is in the `/app` directory
- Shared utilities in `utils.ts`
- Type definitions in `types.ts`
- Context providers in dedicated files (e.g., `LanguageContext.tsx`)
- No `/components` directory - components are in the `/app` root

## Key Features to Preserve

### Privacy First

- **Never** introduce server-side storage or external API calls
- **Never** add analytics, tracking, or telemetry
- All data must remain in the browser's localStorage

### Data Integrity

- Maintain the existing data structure format
- Ensure backward compatibility with exported JSON files
- Validate data on import/export operations

### User Experience

- Preserve the simple, intuitive interface
- Maintain dark mode support
- Keep the responsive design
- Support multiple languages through the translation system

## Common Tasks

### Adding a New Feature

1. Determine if it requires new types (add to `types.ts`)
2. Add utility functions if needed (add to `utils.ts`)
3. Update the component logic
4. Add translations for new UI text in `translations.ts`
5. Test in both light and dark modes
6. Ensure mobile responsiveness

### Adding a New Language

1. Add translations to `translations.ts`
2. Add language option to `LanguageSwitcher.tsx`
3. Test all UI elements with the new language

### Modifying Data Structure

1. Update types in `types.ts`
2. Update localStorage hooks in `useLocalStorage.ts`
3. Ensure backward compatibility with existing data
4. Update import/export functions to handle both old and new formats

## Important Constraints

- **No external dependencies** should be added unless absolutely necessary
- **No build artifacts** (`.next`, `out`, `build`) should be committed
- **No environment variables** or secrets (there's no backend)
- **No server components** - all must be client components
- **No testing frameworks** unless specifically requested

## Linting and Code Quality

- ESLint is configured with Next.js recommended rules
- Run `npx eslint .` before committing changes
- Follow the existing code style for consistency
- TypeScript strict mode must pass without errors

## Security Considerations

- No secrets or API keys (none needed for this app)
- No user authentication (no backend)
- XSS protection through React's default escaping
- Validate JSON structure on import to prevent corruption

## Documentation

- Keep README.md updated with feature changes
- Document any breaking changes to the data format
- Update this file when adding new architectural patterns

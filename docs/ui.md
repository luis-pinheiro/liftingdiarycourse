# UI Coding Standards

## Component Library

**Use shadcn/ui components ONLY.** No custom UI components are permitted in this project.

- All UI elements must come from shadcn/ui
- Do not create custom components for buttons, inputs, cards, modals, etc.
- If a component doesn't exist in shadcn/ui, find the closest alternative or compose existing shadcn/ui components

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

## Date Formatting

**Use date-fns for all date formatting.**

### Standard Date Format

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

```typescript
import { format } from "date-fns";

// Format: ordinal day + abbreviated month + full year
const formattedDate = format(date, "do MMM yyyy");
```

### Examples

| Input Date | Output |
|------------|--------|
| 2025-09-01 | 1st Sep 2025 |
| 2025-08-02 | 2nd Aug 2025 |
| 2026-01-03 | 3rd Jan 2026 |
| 2024-06-04 | 4th Jun 2024 |

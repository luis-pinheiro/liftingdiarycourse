# Lifting Diary

A modern full-stack fitness tracking application built with Next.js 16 and React 19. Users can log workouts, track exercises with sets/reps/weight data, and monitor their fitness progress through an interactive calendar-based interface.

This project demonstrates production-ready development with authentication, database integration, internationalization, and a polished user experience.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Frontend:** React 19, TypeScript 5.9
- **Styling:** Tailwind CSS v4, Radix UI components
- **Authentication:** Clerk
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **Validation:** Zod
- **Internationalization:** next-intl (English/Portuguese)

## Key Features

- **Workout Logging** - Create and edit workouts with name, date, and duration
- **Exercise Tracking** - Log sets, reps, and weight for each exercise
- **Calendar Dashboard** - Visual calendar interface to browse workout history by date
- **User Authentication** - Secure sign-up/sign-in with Clerk, user data isolation
- **Multi-language Support** - Full internationalization (English and Portuguese)
- **Dark Mode** - System-aware theming with light/dark mode support
- **Responsive Design** - Mobile-first layout that works on all devices

## Architecture Highlights

- **Server Components** - Leverages React Server Components for secure data fetching
- **Server Actions** - Type-safe mutations with Zod validation
- **Type Safety** - Strict TypeScript throughout the entire codebase
- **Component Library** - Reusable UI components built on Radix UI primitives
- **Secure by Design** - User ID verification on all data operations

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Clerk and Neon database credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

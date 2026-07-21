# Enterprise White-Label SaaS Platform

A production-ready enterprise SaaS application with clean architecture, scalability, maintainability, and best engineering practices.

## Project Overview

This is a White-Label Business Networking SaaS Platform designed to be organization-agnostic and support unlimited organizations (multi-tenancy). 
The foundation is prepared for future modules such as Organizations, Chapters, Members, Meetings, Attendance, Visitors, Referrals, Finance, Reports, and RBAC.

## Architecture & Technology Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui, Lucide React
- **Backend**: Next.js Route Handlers, Server Actions
- **Database**: Neon PostgreSQL, Prisma ORM
- **Authentication**: Better Auth
- **Validation**: Zod, React Hook Form
- **State Management**: Zustand, TanStack Query
- **Tables**: TanStack Table
- **Components**: FullCalendar, Recharts, Tiptap
- **Utilities**: date-fns
- **Storage**: Cloudflare R2 / AWS S3 SDK
- **Email**: Resend
- **Push Notifications**: Firebase Cloud Messaging
- **Payments**: Razorpay, PayU
- **Documents**: pdf-lib, ExcelJS
- **Deployment**: Docker, Docker Compose, Nginx, Cloudflare
- **Testing**: Vitest, React Testing Library, Playwright

## Folder Structure

Following feature-based clean architecture:

```
src/
├── app/                  # Next.js App Router (Grouped Routes)
├── components/           # Reusable UI components
├── config/               # Global configuration files
├── constants/            # Application constants
├── hooks/                # Custom React hooks
├── lib/                  # Library configurations (Auth, etc.)
├── modules/              # Feature-based business modules
├── providers/            # React context providers
├── styles/               # Global styles
├── types/                # TypeScript definitions
└── utils/                # Helper utilities
prisma/                   # Prisma schema and migrations
docs/                     # Documentation
scripts/                  # Build/utility scripts
docker/                   # Docker configurations
```

## Installation & Development

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment setup:**
   Copy `.env.example` to `.env` and fill in the required credentials.
   ```bash
   cp .env.example .env
   ```
4. **Database setup (Future):**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Production

To build the application for production:

```bash
npm run build
npm start
```

### Docker Deployment

Run with Docker Compose:

```bash
docker-compose up -d --build
```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates an optimized production build.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality.

## Design Principles

- **SOLID Principles**
- **Clean Architecture**
- **Feature-Based Structure**
- **DRY & KISS**
- **Server Components by Default**

## Git Standards

Please follow Conventional Commits for version control.

# Person A: Lead Software Architect & Backend Engineer Handbook

## Introduction

Welcome to the Growcle White-Label Business Networking SaaS Platform. As the Lead Software Architect and Backend Engineer (Person A), you are the cornerstone of the platform's technical foundation. This role goes far beyond simple backend API development; you own the platform architecture and every system that affects the entire application lifecycle.

You are responsible for ensuring that the system is scalable, secure, highly performant, and resilient. You dictate how data is modeled, how services interact, how authentication flows are managed, and how infrastructure scales to meet enterprise demands. Your decisions shape the developer experience for the rest of the team and guarantee that the product can support multi-tenant, white-label configurations securely.

This document serves as your official source of truth for ownership, responsibilities, module specifications, and coding standards.

---

## Responsibilities

### System Architecture
**Purpose:** To define the high-level structure of the application.
**Goals:** Ensure modularity, maintainability, and scalability.
**Implementation Expectations:** Adhere to a strict separation of concerns. Use the Repository Pattern for data access and a Service Layer for business logic.
**Coding Standards:** Strongly typed TypeScript, comprehensive error handling, and centralized configuration.
**Future Scalability:** Design systems to support microservices or serverless deployments if the platform outgrows a monolithic structure.

### Backend Development
**Purpose:** Build the core logic powering all features.
**Goals:** Fast, reliable, and testable backend services.
**Implementation Expectations:** RESTful APIs, strict validation using Zod, and clear domain boundaries.
**Coding Standards:** Avoid god classes. Keep controllers thin and move logic to services.
**Future Scalability:** Implement caching layers (e.g., Redis) for heavy operations.

### Database Design & Prisma
**Purpose:** Model the domain accurately and efficiently.
**Goals:** Maintain data integrity, enforce constraints, and optimize query performance.
**Implementation Expectations:** Use Prisma as the ORM. Ensure all relations are explicitly defined with proper cascading rules.
**Coding Standards:** Pluralized table names (or mapped appropriately), camelCase fields, and comprehensive indexing on foreign keys.
**Future Scalability:** Plan for database sharding and read replicas as multi-tenant data grows.

### Better Auth & Authentication
**Purpose:** Secure user identity and session management.
**Goals:** Frictionless login, secure credential storage, and seamless session validation.
**Implementation Expectations:** Integrate Better Auth for Email/Password and OAuth. Manage sessions via secure HttpOnly cookies.
**Coding Standards:** Never expose secrets or sensitive user data in API responses.
**Future Scalability:** Support enterprise SSO (SAML/OIDC) for large organizational clients.

### Authorization & RBAC
**Purpose:** Ensure users only access what they are permitted to.
**Goals:** A granular, dynamic, and context-aware permission system.
**Implementation Expectations:** Implement middleware and guards that check workspace, organization, and chapter contexts against the user's role.
**Coding Standards:** Use bitwise flags or string-based permissions mapped to roles.
**Future Scalability:** Allow organizations to define custom roles and permission overrides.

### Workspace Engine & Context Resolution
**Purpose:** Isolate data across different tenant levels (Platform, Organization, Chapter).
**Goals:** Prevent data leakage and ensure accurate context routing.
**Implementation Expectations:** Middleware must resolve the workspace from the URL or headers and inject it into the request context.
**Coding Standards:** Strict multi-tenant checks on every database query using Prisma middleware or base repository classes.
**Future Scalability:** Support deep hierarchical workspaces (e.g., Region -> District -> Chapter).

### API Development & Service Layer
**Purpose:** Expose platform capabilities to the frontend and external clients.
**Goals:** Predictable, documented, and secure endpoints.
**Implementation Expectations:** Use Next.js Route Handlers. Implement standard response wrappers.
**Coding Standards:** Versioned APIs, consistent error codes, and strict input validation.
**Future Scalability:** GraphQL integration or gRPC for internal service communication.

### Payment Gateway & Finance
**Purpose:** Handle monetization, subscriptions, and invoicing.
**Goals:** Secure processing, accurate ledgering, and PCI compliance.
**Implementation Expectations:** Integrate Stripe/Razorpay. Handle webhooks securely with signature verification.
**Coding Standards:** Idempotent operations for all financial transactions.
**Future Scalability:** Multi-currency support and localized tax calculations.

### DevOps, Deployment & VPS
**Purpose:** Ensure the platform is always available and performant.
**Goals:** Zero-downtime deployments and automated infrastructure provisioning.
**Implementation Expectations:** Deploy via Hostinger VPS using PM2 for process management and NGINX as a reverse proxy.
**Coding Standards:** Infrastructure as Code (IaC) principles where applicable.
**Future Scalability:** Migration to Kubernetes or AWS ECS for automated horizontal scaling.

### CI/CD & Security
**Purpose:** Automate quality assurance and protect against vulnerabilities.
**Goals:** Fast feedback loops and robust security posture.
**Implementation Expectations:** GitHub Actions for linting, testing, and deployment. Implement rate limiting, CORS, and CSRF protection.
**Coding Standards:** Fail builds on security linting errors or test failures.
**Future Scalability:** Automated penetration testing and dependency vulnerability scanning.

---

## Module Ownership

### Authentication
**Purpose:** Manage user identities.
**Responsibilities:** Login, Registration, Password Reset, Email Verification.
**Folder Structure:** `src/features/auth/api`, `src/features/auth/services`
**Database Tables:** `User`, `Session`, `Account`, `Verification`
**APIs:** `/api/auth/*`
**Services:** `AuthService`, `SessionService`
**Future Enhancements:** Biometric authentication, 2FA, and SSO.

### Organizations
**Purpose:** Top-level tenant management.
**Responsibilities:** Organization creation, branding configuration, and global settings.
**Folder Structure:** `src/features/organizations/`
**Database Tables:** `Organization`
**APIs:** `/api/organizations/*`
**Future Enhancements:** Cross-organization networking and global reporting.

### Chapters
**Purpose:** Local networking groups within organizations.
**Responsibilities:** Chapter setup, goal tracking, and regional management.
**Database Tables:** `Chapter`
**APIs:** `/api/chapters/*`
**Future Enhancements:** Automated chapter health scoring.

### Members
**Purpose:** Individual participants in the platform.
**Responsibilities:** Profile management, directory indexing, and role assignment.
**Database Tables:** `Member`
**APIs:** `/api/members/*`
**Future Enhancements:** AI-driven member matchmaking.

### Meetings & Attendance
**Purpose:** Core networking events.
**Responsibilities:** Scheduling, agenda management, and roll call.
**Database Tables:** `Meeting`, `MeetingAttendance`
**APIs:** `/api/meetings/*`
**Future Enhancements:** Zoom integration and automated absence warnings.

### Referrals & One-to-Ones
**Purpose:** Track business generated and relationship building.
**Responsibilities:** Logging referrals, tracking monetary value, scheduling 1-to-1s.
**Database Tables:** `Referral`, `OneToOne`
**Future Enhancements:** CRM integrations (Salesforce/HubSpot).

### Finance & Payments
**Purpose:** Collect dues and manage chapter expenses.
**Responsibilities:** Invoice generation, payment collection, receipting.
**Database Tables:** `Invoice`, `Payment`, `Subscription`
**Future Enhancements:** Automated dunning and accounting software sync.

### Notifications
**Purpose:** Keep users informed of platform activity.
**Responsibilities:** Email, SMS, and in-app push notifications.
**Database Tables:** `Notification`
**Future Enhancements:** Customizable notification digests.

---

## Database Ownership

**All Prisma Models:** You own the schema. Every model must have a clear primary key (`id` UUID), `createdAt`, and `updatedAt` timestamps.
**Relationships:** Enforce referential integrity. Use `onDelete: Cascade` carefully to prevent accidental data loss.
**Indexes:** Index heavily queried fields (e.g., `email`, `organizationId`, `chapterId`).
**Migration Strategy:** Use Prisma Migrate. Never edit migrations manually after deployment.
**Backup Strategy:** Automated daily pg_dump to AWS S3.
**Seed Strategy:** Maintain robust seed scripts in `prisma/seed.ts` for rapid local environment setup.

---

## Authentication & RBAC Ownership

**Better Auth Implementation:** You own the integration of Better Auth. Ensure that the Next.js middleware intercepts requests, validates the session token, and resolves the user object.
**Protected Routes:** Implement a robust higher-order function or middleware to protect API routes.
**Permission Engine:** Roles (e.g., PLATFORM_ADMIN, ORG_ADMIN, CHAPTER_ADMIN, MEMBER) map to specific permissions (e.g., `members.create`, `meetings.view`).
**Workspace Resolution:** The system must determine context based on the URL (e.g., `/org/123/dashboard` vs `/chapter/456/dashboard`) and validate the user's role within that specific tenant.

---

## API Ownership

**REST Conventions:** Use standard HTTP methods (GET, POST, PUT, PATCH, DELETE).
**Validation:** All incoming payloads must be validated using Zod schemas before processing.
**Error Handling:** Return standardized JSON error responses containing `message`, `code`, and `details`.
**Pagination & Filtering:** Implement cursor-based or offset-based pagination for all list endpoints. Support standard filtering paradigms.

---

## DevOps Ownership

**Deployment Process:** Ensure smooth deployment pipelines to the Hostinger VPS.
**PM2 & NGINX:** Manage process daemonization and reverse proxy configurations (SSL termination, gzip compression).
**Environment Variables:** Maintain strict separation of `.env` files across development, staging, and production.
**Logging & Monitoring:** Implement centralized logging. Ensure critical errors alert the engineering team immediately.

---

## Daily Responsibilities

1. **Morning:** Review error logs, monitor VPS health, and check CI/CD pipeline statuses.
2. **Development:** Architect new database models, build backend services, and expose REST APIs.
3. **Review:** Conduct code reviews focusing on security, performance, and architecture adherence.
4. **Testing:** Write and maintain unit and integration tests for core services.
5. **Documentation:** Keep Swagger/OpenAPI docs updated.

---

## Deliverables

Before project completion, Person A must deliver:
1. A fully normalized, performant PostgreSQL database schema.
2. A secure, multi-tenant authentication and RBAC engine.
3. Complete RESTful API coverage for all platform modules.
4. Integrated payment gateways (Stripe/Razorpay) with webhook handling.
5. A fully automated deployment pipeline targeting the production VPS.
6. Comprehensive backend documentation and system architecture diagrams.

# Database Naming Conventions

## Tables
- PascalCase (e.g., `OrganizationUser`)

## Columns
- camelCase (e.g., `firstName`, `organizationId`)
- Primary keys are always `id` (UUID).
- Foreign keys are named `[Entity]Id` (e.g., `organizationId`).
- Dates use `At` suffix (e.g., `createdAt`, `updatedAt`, `deletedAt`).\n
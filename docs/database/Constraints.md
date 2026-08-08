# Constraints

## Unique Constraints
- `email` on User table.
- `slug` on Organization table.

## Foreign Key Constraints
- Enforce referential integrity. Deletions should generally be RESTRICT unless cascade is explicitly safe.

## Business Constraints
- Implemented at the Prisma layer (e.g., checking status enums).\n
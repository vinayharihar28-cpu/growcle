# Indexing Strategy

## Primary Indexes
- All `id` columns are automatically indexed as Primary Keys.

## Foreign Key Indexes
- Every foreign key must have an index to prevent full table scans during joins (e.g., `@@index([organizationId])`).

## Search Indexes
- Frequently searched text fields (e.g., email, names) should be indexed.\n
# Authentication

---

## Overview
Authentication is managed using Better Auth, providing a secure, session-based authentication mechanism.

## Authentication Model
- Every individual has **one User account**.
- A user logs in once using a single email address.
- A user may belong to one or more organizations.
- The application provides a **Workspace Switcher (Role Context Switcher)** rather than separate accounts or separate logins.
- Switching workspaces changes the available navigation and functionality without requiring re-authentication.

## Security
The platform is designed following enterprise security best practices and is architected to support future compliance with frameworks such as GDPR, SOC 2, ISO 27001, and other regional privacy regulations through configuration and operational controls.

Key implementations:
- Password Hashing (Argon2 via Better Auth).
- Secure Session Management.
- Protection against common attacks (XSS, CSRF, Brute Force).
- Rate Limiting on authentication endpoints.

import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    // Database configuration will be linked to Prisma in Phase 2
  },
  emailAndPassword: {
    enabled: true,
  },
});

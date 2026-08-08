import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/shared/lib/db";
import { authConfig } from "./config";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: authConfig.secret,
  baseURL: authConfig.baseURL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendVerificationEmail: async ({ user, url, token }: { user: any, url: string, token: string }) => {
      // For development, log the token/URL. In production, connect an email service.
      if (authConfig.isDev) {
        console.log(`[DEV ONLY] Verification email for ${user.email}`);
        console.log(`[DEV ONLY] Verify URL: ${url}`);
        console.log(`[DEV ONLY] Token: ${token}`);
      }
    },
    sendResetPassword: async ({ user, url, token }: { user: any, url: string, token: string }) => {
      // For development, log the token/URL. In production, connect an email service.
      if (authConfig.isDev) {
        console.log(`[DEV ONLY] Password reset for ${user.email}`);
        console.log(`[DEV ONLY] Reset URL: ${url}`);
        console.log(`[DEV ONLY] Token: ${token}`);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days default session duration
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes cache
    }
  },
});

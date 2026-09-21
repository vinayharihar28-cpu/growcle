import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/shared/lib/db";
import { authConfig } from "./config";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: authConfig.secret,
  baseURL: authConfig.baseURL,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    process.env.NEXT_PUBLIC_APP_URL || "",
    process.env.BETTER_AUTH_URL || "",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "",
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => {
        // Use native bcrypt for performance, 10 rounds is standard
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }: { hash: string; password: string }) => {
        // Use native bcrypt for fast verification
        return await bcrypt.compare(password, hash);
      },
    },
    sendVerificationEmail: async ({ user, url, token }: { user: any, url: string, token: string }) => {
      if (authConfig.isDev) {
        console.log(`[DEV ONLY] Verification email for ${user.email}`);
        console.log(`[DEV ONLY] Verify URL: ${url}`);
        console.log(`[DEV ONLY] Token: ${token}`);
      }
    },
    sendResetPassword: async ({ user, url, token }: { user: any, url: string, token: string }) => {
      if (authConfig.isDev) {
        console.log(`[DEV ONLY] Password reset for ${user.email}`);
        console.log(`[DEV ONLY] Reset URL: ${url}`);
        console.log(`[DEV ONLY] Token: ${token}`);
      }
    },
  },
  socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  } : {},
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
});

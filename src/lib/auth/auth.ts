import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/shared/lib/db";
import { authConfig } from "./config";
import bcrypt from "bcrypt";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: authConfig.secret,
  baseURL: authConfig.baseURL,
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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
});

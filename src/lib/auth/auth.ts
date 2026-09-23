import { betterAuth, APIError } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/shared/lib/db";
import { authConfig } from "./config";
import bcrypt from "bcryptjs";
import { isRegisteredMember } from "./member-auth-sync";

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
    authConfig.baseURL,
    process.env.NEXT_PUBLIC_APP_URL || "",
    process.env.BETTER_AUTH_URL || "",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "",
  ].filter(Boolean),
  user: {
    // Gate incoming identities across all authentication methods (Google OAuth, Credentials, etc.)
    validateUserInfo: async ({ user }) => {
      const email = user.email?.trim().toLowerCase();
      if (!email) {
        return {
          error: "EMAIL_REQUIRED",
          errorDescription: "A valid email address is required to sign in.",
        };
      }

      const member = await isRegisteredMember(email);
      if (!member) {
        return {
          error: "ACCESS_DENIED_UNREGISTERED",
          errorDescription: "Access Denied: Your email is not registered as a member in the database. Please contact your Chapter Administrator.",
        };
      }

      if (member.status === "SUSPENDED" || member.status === "EXPIRED") {
        return {
          error: "ACCESS_DENIED_SUSPENDED",
          errorDescription: "Access Denied: Your chapter membership is currently suspended or expired. Please contact support.",
        };
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = user.email?.trim().toLowerCase();
          const member = await isRegisteredMember(email);
          if (!member) {
            throw new APIError("FORBIDDEN", {
              message: "Access Denied: Only pre-registered chapter members can access the platform.",
            });
          }
        },
        after: async (user) => {
          // Link member to this newly authenticated User record
          await db.member.updateMany({
            where: { email: { equals: user.email, mode: "insensitive" } },
            data: { userId: user.id },
          });
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await db.user.findUnique({ where: { id: session.userId } });
          if (!user) {
            throw new APIError("FORBIDDEN", { message: "User record not found." });
          }

          const member = await isRegisteredMember(user.email);
          if (!member) {
            throw new APIError("FORBIDDEN", {
              message: "Access Denied: Only registered members in the database can sign in.",
            });
          }

          if (member.status === "SUSPENDED" || member.status === "EXPIRED") {
            throw new APIError("FORBIDDEN", {
              message: "Access Denied: Your chapter membership is currently suspended or expired.",
            });
          }

          // Ensure userId is linked
          if (member.userId !== user.id) {
            await db.member.update({
              where: { id: member.id },
              data: { userId: user.id },
            });
          }
        },
      },
    },
  },
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
      enabled: false,
    },
  },
});

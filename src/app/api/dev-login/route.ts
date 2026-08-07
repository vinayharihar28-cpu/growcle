import { db } from "@/shared/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  try {
    // 1. Find or create default organization
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: {
          name: "Growcle Apex",
          primaryColor: "#4f46e5",
        },
      });
    }

    // 2. Find or create default chapter
    let chapter = await db.chapter.findFirst({
      where: { organizationId: org.id },
    });
    if (!chapter) {
      chapter = await db.chapter.create({
        data: {
          name: "Silicon Valley Founders",
          organizationId: org.id,
        },
      });
    }

    // 3. Find or create the default user
    let user = await db.user.findUnique({
      where: { email: "alexandra.chen@apextechnologies.io" },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name: "Alexandra Chen",
          email: "alexandra.chen@apextechnologies.io",
          emailVerified: true,
        },
      });
    }

    // 4. Find or create the member record
    let member = await db.member.findUnique({
      where: { email: "alexandra.chen@apextechnologies.io" },
    });

    if (!member) {
      member = await db.member.create({
        data: {
          userId: user.id,
          firstName: "Alexandra",
          lastName: "Chen",
          email: "alexandra.chen@apextechnologies.io",
          organizationId: org.id,
          chapterId: chapter.id,
        },
      });
    }

    // 5. Create session in database directly
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    });

    // Set the cookie header so the client receives the session token
    const response = NextResponse.json({ success: true });
    
    // Better Auth session cookie options
    response.cookies.set("better-auth.session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Dev login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

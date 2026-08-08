import { Sidebar } from "@/shared/components/layout/sidebar";
import { Header } from "@/shared/components/layout/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/shared/lib/db";
import { AuthInitializer } from "@/shared/components/layout/auth-initializer";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Find or create database Member matching session email
  let member = await db.member.findFirst({
    where: { userId: session.user.id },
  });

  if (!member) {
    // Dynamically provision organization and chapter if none exist
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: {
          name: "Growcle Apex",
          slug: "growcle-apex",
          primaryColor: "#4f46e5",
        },
      });
    }
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

    const nameParts = (session.user.name || "New Member").split(" ");
    const firstName = nameParts[0] || "New";
    const lastName = nameParts.slice(1).join(" ") || "Member";

    member = await db.member.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        email: session.user.email,
        organizationId: org.id,
        chapterId: chapter.id,
      },
    });
  }

  const clientUser = {
    id: session.user.id,
    name: session.user.name || "Member",
    email: session.user.email,
    roles: ["MEMBER"],
  };

  const clientMember = {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    chapterId: member.chapterId || undefined,
    organizationId: member.organizationId,
  };

  return (
    <div className="flex min-h-screen">
      <AuthInitializer user={clientUser} member={clientMember} />
      <Sidebar />
      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out md:ml-64">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


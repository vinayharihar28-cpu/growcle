import { Sidebar } from "@/shared/components/layout/sidebar";
import { Header } from "@/shared/components/layout/header";
import { MobileNavBar } from "@/shared/components/layout/mobile-nav-bar";
import { db } from "@/shared/lib/db";
import { AuthInitializer } from "@/shared/components/layout/auth-initializer";
import { ChapterThemeApplier } from "@/shared/components/layout/chapter-theme-applier";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getUserAvailableRoles } from "@/lib/auth/roles";
import { generateMemberId } from "@/lib/id-generator";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  // Independent reads run concurrently. Role resolution is cached for this
  // request and reused by the dashboard index and nested workspace layouts.
  const memberQuery = db.member.findFirst({
    where: {
      OR: [
        { userId: session.user.id },
        { email: session.user.email },
      ],
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
      chapter: true,
    },
  });

  const chaptersQuery = db.$queryRawUnsafe<any[]>(
    `SELECT id, name, "chapterCode", "themeColor" FROM "Chapter" WHERE "isActive" = true ORDER BY name ASC`
  ).catch(async () => {
    return db.chapter.findMany({
      where: { isActive: true },
      select: { id: true, name: true, chapterCode: true },
      orderBy: { name: "asc" },
    });
  });

  let [member, availableRoles, allChapters] = await Promise.all([
    memberQuery,
    getUserAvailableRoles(session.user.id, session.user.email),
    chaptersQuery,
  ]);

  if (!member) {
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: {
          name: "Growcle Apex Network",
          slug: "growcle-apex-network",
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
          chapterCode: "SVF-01",
          organizationId: org.id,
        },
      });
    }

    const nameParts = (session.user.name || "Member").split(" ");
    const firstName = nameParts[0] || "Member";
    const lastName = nameParts.slice(1).join(" ") || "User";

    const memberCode = await generateMemberId(chapter.id);

    member = await db.member.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        email: session.user.email,
        membershipNumber: memberCode,
        profileImage: (session.user as any).image || null,
        organizationId: org.id,
        chapterId: chapter.id,
      },
      include: {
        roles: {
          include: { role: true },
        },
        chapter: true,
      },
    });
  } else {
    // If member exists but doesn't have membershipNumber or profileImage, backfill them
    let needsUpdate = false;
    const updateData: any = {};
    if (!member.membershipNumber) {
      updateData.membershipNumber = await generateMemberId(member.chapterId);
      needsUpdate = true;
    }
    if (!member.profileImage && (session.user as any).image) {
      updateData.profileImage = (session.user as any).image;
      needsUpdate = true;
    }
    if (needsUpdate) {
      member = await db.member.update({
        where: { id: member.id },
        data: updateData,
        include: {
          roles: {
            include: { role: true },
          },
          chapter: true,
        },
      });
    }
  }

  const clientUser = {
    id: session.user.id,
    name: session.user.name || `${member.firstName} ${member.lastName}`,
    email: session.user.email,
    roles: availableRoles,
    image: (session.user as any).image || member.profileImage || undefined,
  };

  const clientMember = {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    chapterId: member.chapterId || undefined,
    organizationId: member.organizationId,
    profileImage: member.profileImage || (session.user as any).image || undefined,
    membershipNumber: member.membershipNumber || undefined,
  };

  return (
    <div className="flex min-h-screen">
      <AuthInitializer
        user={clientUser}
        member={clientMember}
        availableRoles={availableRoles}
        chapters={allChapters}
      />
      <ChapterThemeApplier />
      <Sidebar />
      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out lg:ml-64">
        <Header />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto pb-20 sm:pb-8">
          {children}
        </main>
      </div>
      <MobileNavBar />
    </div>
  );
}

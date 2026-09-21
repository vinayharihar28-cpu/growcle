import { getCurrentSession } from "@/lib/auth/session";
import { getUserAvailableRoles } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function LeadershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const roles = await getUserAvailableRoles(session.user.id, session.user.email);
  if (!roles.includes("Leadership Team")) {
    if (roles.includes("Admin")) {
      redirect("/dashboard/admin");
    }
    if (roles.includes("Director")) {
      redirect("/dashboard/director");
    }
    redirect("/dashboard/member");
  }

  return <>{children}</>;
}

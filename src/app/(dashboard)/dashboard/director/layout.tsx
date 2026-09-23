import { getCurrentSession } from "@/lib/auth/session";
import { getUserAvailableRoles } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function DirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const roles = await getUserAvailableRoles(session.user.id, session.user.email);
  if (!roles.includes("Director") && !roles.includes("Admin")) {
    if (roles.includes("Leadership Team")) {
      redirect("/dashboard/leadership");
    }
    redirect("/dashboard/member");
  }

  return <>{children}</>;
}

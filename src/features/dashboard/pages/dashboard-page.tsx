import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getDefaultDashboardPath, getUserAvailableRoles } from "@/lib/auth/roles";
import { cookies } from "next/headers";
import { Role } from "@/shared/stores/workspace";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const roles = await getUserAvailableRoles(session.user.id, session.user.email);
  const cookieStore = await cookies();
  const savedRoleCookie = cookieStore.get("active-role")?.value;
  const savedRole = savedRoleCookie ? (decodeURIComponent(savedRoleCookie) as Role) : undefined;

  if (savedRole && (roles.includes(savedRole) || (savedRole === "Director" && roles.includes("Admin")))) {
    if (savedRole === "Admin" || savedRole === "Director") redirect("/dashboard/admin");
    if (savedRole === "Leadership Team") redirect("/dashboard/leadership");
    if (savedRole === "Member") redirect("/dashboard/member");
  }

  redirect(getDefaultDashboardPath(roles));
}

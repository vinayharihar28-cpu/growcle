import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getDefaultDashboardPath, getUserAvailableRoles } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const roles = await getUserAvailableRoles(session.user.id, session.user.email);
  redirect(getDefaultDashboardPath(roles));
}

import { NotificationsManagementView } from "@/features/director/components/notifications-management-view";

export const metadata = {
  title: "Chapter Broadcasts | Director Dashboard | Growcle",
  description: "Send official announcements and memos to assigned chapters.",
};

export default function DirectorNotificationsPage() {
  return <NotificationsManagementView />;
}

import { VisitorsManagementView } from "@/features/director/components/visitors-management-view";

export const metadata = {
  title: "Visitor Management | Director Dashboard | Growcle",
  description: "Track chapter visitors and convert qualified guests to active members.",
};

export default function DirectorVisitorsPage() {
  return <VisitorsManagementView />;
}

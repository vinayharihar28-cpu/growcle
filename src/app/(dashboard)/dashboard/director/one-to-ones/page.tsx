import { OneToOnesManagementView } from "@/features/director/components/one-to-ones-management-view";

export const metadata = {
  title: "1-to-1 Networking Activity | Director Dashboard | Growcle",
  description: "Monitor member 1-to-1 networking meetings across assigned chapters.",
};

export default function DirectorOneToOnesPage() {
  return <OneToOnesManagementView />;
}

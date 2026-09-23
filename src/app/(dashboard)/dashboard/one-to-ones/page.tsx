import { Metadata } from "next";
import { OneToOnesManagementView } from "@/features/director/components/one-to-ones-management-view";

export const metadata: Metadata = {
  title: "1-to-1 Synergy Sessions | Admin Operations",
  description: "Monitor 1-to-1 member networking discussions and collaboration outcomes across chapters.",
};

export default function OneToOnesPage() {
  return <OneToOnesManagementView />;
}

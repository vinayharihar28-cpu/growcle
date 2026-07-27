import { MembersDirectoryGrid } from "@/features/directory/components/members-directory-grid";

export default function MembersDirectoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Members Directory</h2>
        <p className="text-muted-foreground">Search and connect with other professionals in your chapter.</p>
      </div>
      
      <MembersDirectoryGrid />
    </div>
  );
}

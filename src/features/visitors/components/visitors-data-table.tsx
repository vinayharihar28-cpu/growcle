"use client";

import { useQuery } from "@tanstack/react-query";
import { getVisitors } from "../actions/visitors";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useWorkspaceStore } from "@/shared/stores/workspace";

export function VisitorsDataTable() {
  const { selectedChapterId } = useWorkspaceStore();

  const { data: visitors = [], isLoading } = useQuery({
    queryKey: ["visitors", selectedChapterId],
    queryFn: () => getVisitors(selectedChapterId),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Log</CardTitle>
        <CardDescription>Track all visitors across chapters received from members, leadership, and public registrations.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading visitors...</div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No visitors found in the system.
                    </TableCell>
                  </TableRow>
                ) : (
                  visitors.map((visitor: any) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {new Date(visitor.visitDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold">{visitor.firstName} {visitor.lastName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-xs">
                          {visitor.chapterName || "Assigned"}
                        </Badge>
                      </TableCell>
                      <TableCell>{visitor.businessName || "-"}</TableCell>
                      <TableCell>{visitor.industry || "-"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{visitor.invitedByName || "Direct"}</TableCell>
                      <TableCell>
                        <Badge variant={visitor.status === "ATTENDED" || visitor.status === "CONVERTED" ? "default" : "secondary"}>
                          {visitor.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

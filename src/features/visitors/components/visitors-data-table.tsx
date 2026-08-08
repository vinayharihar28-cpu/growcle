"use client";

import { useQuery } from "@tanstack/react-query";
import { getVisitors } from "../actions/visitors";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export function VisitorsDataTable() {
  const { data: visitors = [], isLoading } = useQuery({
    queryKey: ["visitors"],
    queryFn: () => getVisitors(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Log</CardTitle>
        <CardDescription>Track visitors who have attended or are scheduled to attend your chapter.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading visitors...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No visitors found.
                    </TableCell>
                  </TableRow>
                ) : (
                  visitors.map((visitor: any) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">
                        {new Date(visitor.visitDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{visitor.firstName} {visitor.lastName}</TableCell>
                      <TableCell>{visitor.businessName || "-"}</TableCell>
                      <TableCell>{visitor.industry || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={visitor.status === "ATTENDED" ? "default" : "outline"}>
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

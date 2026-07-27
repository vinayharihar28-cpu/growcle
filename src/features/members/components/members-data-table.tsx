"use client";

import { useQuery } from "@tanstack/react-query";
import { getMembers } from "../actions/members";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export function MembersDataTable() {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members Directory</CardTitle>
        <CardDescription>View all members in your organization.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading members...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Chapter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.firstName} {member.lastName}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.businessName || "-"}</TableCell>
                      <TableCell>{member.industry || "-"}</TableCell>
                      <TableCell>
                        {member.chapter ? (
                          <Badge variant="outline">{member.chapter.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
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

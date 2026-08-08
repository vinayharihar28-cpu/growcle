"use client";

import { useQuery } from "@tanstack/react-query";
import { getReferrals } from "../actions/referrals";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export function ReferralsDataTable() {
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ["referrals"],
    queryFn: () => getReferrals(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referrals Tracking</CardTitle>
        <CardDescription>Track referrals given and received within your chapter.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading referrals...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Referral Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No referrals found.
                    </TableCell>
                  </TableRow>
                ) : (
                  referrals.map((ref: any) => (
                    <TableRow key={ref.id}>
                      <TableCell className="font-medium">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{ref.fromMember.firstName} {ref.fromMember.lastName}</TableCell>
                      <TableCell>{ref.toMember.firstName} {ref.toMember.lastName}</TableCell>
                      <TableCell>{ref.referralName}</TableCell>
                      <TableCell>
                        <Badge variant={ref.status === "CLOSED_WON" ? "default" : "secondary"}>
                          {ref.status}
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

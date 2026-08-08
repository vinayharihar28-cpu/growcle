"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "../actions/organizations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Building2 } from "lucide-react";

export function OrganizationsDataTable() {
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          SaaS Tenants
        </CardTitle>
        <CardDescription>Overview of all white-label organizations currently on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading organizations...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization Name</TableHead>
                  <TableHead>Custom Domain</TableHead>
                  <TableHead className="text-right">Chapters</TableHead>
                  <TableHead className="text-right">Total Members</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No organizations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  organizations.map((org: any) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>{org.customDomain || "-"}</TableCell>
                      <TableCell className="text-right">{org._count.chapters}</TableCell>
                      <TableCell className="text-right">{org._count.members}</TableCell>
                      <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Active</Badge>
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

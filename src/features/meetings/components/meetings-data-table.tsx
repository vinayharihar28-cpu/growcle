"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeetings } from "../actions/meetings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export function MeetingsDataTable() {
  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: () => getMeetings(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
        <CardDescription>View and manage scheduled chapter meetings and agendas.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading meetings...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Agenda</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No meetings scheduled.
                    </TableCell>
                  </TableRow>
                ) : (
                  meetings.map((meeting: any) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        {new Date(meeting.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{meeting.location || "TBD"}</TableCell>
                      <TableCell>{meeting.agenda || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={meeting.status === "COMPLETED" ? "default" : "secondary"}>
                          {meeting.status}
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

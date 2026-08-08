"use client";

import { useQuery } from "@tanstack/react-query";
import { getChapterStats } from "../actions/chapter";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, Handshake, Calendar, UserPlus } from "lucide-react";

export default function ChapterOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["chapterStats"],
    queryFn: () => getChapterStats(),
  });

  if (isLoading) {
    return <div className="text-muted-foreground text-sm">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chapter Overview</h2>
        <p className="text-muted-foreground">High-level statistics for your chapter.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals Passed</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors Hosted</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVisitors || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Meeting</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.upcomingMeetingDate 
                ? new Date(stats.upcomingMeetingDate).toLocaleDateString()
                : "None"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

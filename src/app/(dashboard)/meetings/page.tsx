"use client";

import { Calendar as CalendarIcon, ChevronDown, Plus, ExternalLink, HelpCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const meetings = [
  { id: 1, date: "Sun, Jul 26, 2026", active: true, status: "Locked until Sunday" },
  { id: 2, date: "Sun, Jul 19, 2026", active: false, status: "Meeting Closed", open: true },
  { id: 3, date: "Sun, Jul 12, 2026", active: false, status: "", open: true },
  { id: 4, date: "Sun, Jul 05, 2026", active: false, status: "", open: true },
  { id: 5, date: "Sun, Jun 28, 2026", active: false, status: "", open: true },
  { id: 6, date: "Sun, Jun 21, 2026", active: false, status: "", open: true },
];

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground text-sm">Manage and schedule chapter meeting logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-background border rounded-md px-3 py-2 text-sm">
            <span className="text-muted-foreground mr-2 font-medium">MEETING DAY</span>
            <span className="font-semibold text-primary">Sunday</span>
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex bg-background border rounded-md text-sm">
             <div className="flex items-center px-3 py-2 border-r text-muted-foreground">
               <CalendarIcon className="mr-2 h-4 w-4" />
               dd-mm-yyyy
             </div>
             <Button className="rounded-l-none bg-blue-700 hover:bg-blue-800 text-white shadow-none border-none">
               <Plus className="mr-2 h-4 w-4" />
               Schedule Manual Meet
             </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between bg-secondary/50 rounded-t-xl pb-4 pt-4 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Upcoming & Past Schedules</CardTitle>
              <Badge className="bg-green-700 hover:bg-green-800 text-white rounded font-bold text-[10px] px-2 py-0.5">SYSTEM AUTO-GEN</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-center justify-between p-4 text-xs font-bold uppercase text-muted-foreground bg-background">
                  <span>Date</span>
                  <span>Action</span>
                </div>
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-background hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-secondary text-center px-3 py-1.5 rounded-lg border border-border/50">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">{meeting.date.split(',')[1].trim().split(' ')[0]}</div>
                        <div className="text-lg font-bold">{meeting.date.split(',')[1].trim().split(' ')[1]}</div>
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-base">{meeting.date}</p>
                        {meeting.active && (
                          <p className="text-xs font-bold text-green-600 mt-0.5">Active Window</p>
                        )}
                        {!meeting.active && meeting.status && (
                          <p className="text-xs font-medium text-muted-foreground mt-0.5">{meeting.status}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {meeting.active ? (
                        <span className="text-sm font-medium text-muted-foreground hidden sm:block">{meeting.status}</span>
                      ) : (
                        <Button variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 text-sm font-semibold px-6">
                          <ExternalLink className="mr-2 h-4 w-4 opacity-50" />
                          Open Meeting
                        </Button>
                      )}
                      <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 font-medium">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-background rounded-b-xl flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing 6 of 52 scheduled meetings</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded"><ChevronDown className="h-4 w-4 rotate-90" /></Button>
                  <Button variant="default" size="icon" className="w-8 h-8 rounded bg-blue-700">1</Button>
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded bg-background">2</Button>
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded bg-background">3</Button>
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded"><ChevronDown className="h-4 w-4 -rotate-90" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full xl:w-80 space-y-6">
          <Card className="bg-blue-700 text-white border-blue-600 overflow-hidden relative">
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <CalendarIcon className="w-40 h-40" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-blue-200">Total Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-4">48</div>
              <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3 mr-1.5" />
                +4 this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Avg. Attendance</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Unsettled Dues</p>
                <p className="text-2xl font-bold text-purple-600">₹12,400</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">New Visitors</p>
                <p className="text-2xl font-bold text-blue-600">15 <span className="text-xs font-medium text-muted-foreground">Last Sun</span></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-md">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold">Need Help?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Can't schedule a meeting? Ensure you haven't exceeded the weekly cap for your chapter tier.
              </p>
              <Button variant="outline" className="w-full bg-background">View FAQ</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

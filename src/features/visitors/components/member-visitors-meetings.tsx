"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { createVisitor, getVisitors } from "../actions/visitors";
import { useAuthStore } from "@/shared/stores/auth";
import { Calendar as CalendarIcon, UserPlus, MapPin, Clock, Video, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const visitorInviteSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email address required"),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  visitDate: z.string().min(1, "Please select visit date"),
});

type VisitorInviteFormData = z.infer<typeof visitorInviteSchema>;

const mockUpcomingMeetings = [
  {
    id: "m1",
    title: "Weekly Chapter Business Breakfast & Visitor Day",
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    location: "Grand Ballroom, Marriott Marquis / Hybrid Zoom",
    speaker: "Marcus Vance (Managing Director)",
    topic: "Scaling Strategic Alliances & Referral Velocity",
    isHybrid: true,
  },
  {
    id: "m2",
    title: "Monthly Feature Presentation & Strategic 1-to-1s",
    date: new Date(Date.now() + 86400000 * 10).toISOString(),
    location: "Enterprise Hall & Virtual Room 2",
    speaker: "Sarah Jenkins (Apex Commercial)",
    topic: "Commercial Real Estate Opportunities 2026",
    isHybrid: false,
  },
  {
    id: "m3",
    title: "Executive Chapter Growth & Leadership Review",
    date: new Date(Date.now() + 86400000 * 17).toISOString(),
    location: "Silicon Valley Tech Center",
    speaker: "Dr. Elena Rostova",
    topic: "Metrics & Traffic Light Score Optimization",
    isHybrid: true,
  },
];

export function MemberVisitorsMeetings() {
  const { currentMember } = useAuthStore();
  const [invitedVisitors, setInvitedVisitors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [inviteSuccess, setInviteSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VisitorInviteFormData>({
    resolver: zodResolver(visitorInviteSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      businessName: "",
      industry: "",
      visitDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    }
  });

  const loadVisitors = React.useCallback(async () => {
    try {
      setLoading(true);
      const list = await getVisitors();
      setInvitedVisitors(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadVisitors();
  }, [loadVisitors]);

  const onSubmit = async (data: VisitorInviteFormData) => {
    if (!currentMember?.chapterId) {
      setErrorMsg("Chapter information not loaded. Please re-login.");
      return;
    }

    try {
      setErrorMsg("");
      setInviteSuccess(false);

      await createVisitor({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        businessName: data.businessName,
        industry: data.industry,
        chapterId: currentMember.chapterId,
        visitDate: data.visitDate,
      });

      setInviteSuccess(true);
      reset();
      loadVisitors();
      setTimeout(() => setInviteSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to send visitor invitation.");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Upcoming Meetings Calendar Showcase */}
      <Card className="rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <CalendarIcon className="h-4 w-4 text-indigo-400" />
            <span>Chapter Meeting Schedule & Calendar</span>
          </div>
          <CardTitle className="text-xl font-extrabold text-white mt-1">
            Upcoming Chapter Meetings & Visitor Days
          </CardTitle>
          <CardDescription className="text-xs text-slate-300">
            Review meeting topics, feature speakers, and hybrid Zoom links.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockUpcomingMeetings.map((meet) => {
              const d = new Date(meet.date);
              return (
                <div 
                  key={meet.id} 
                  className="rounded-2xl bg-card border border-border/80 p-5 space-y-3 hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" })}
                    </span>
                    {meet.isHybrid && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Video className="h-3 w-3" /> Hybrid Zoom
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-foreground line-clamp-2">{meet.title}</h4>
                  
                  <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span>7:00 AM – 8:30 AM PST</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{meet.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 text-[11px]">
                    <span className="font-semibold text-foreground">Feature Speaker: </span>
                    <span className="text-muted-foreground">{meet.speaker}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Visitor Invitation Form & Past Visitors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Invite Visitor Form */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" /> Invite a Visitor / Guest
            </CardTitle>
            <CardDescription className="text-xs">
              Send an automated email invitation to a fellow professional to visit your chapter.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {inviteSuccess && (
              <div className="p-4 mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> Invitation sent! Your guest has been registered for the meeting.
              </div>
            )}

            {errorMsg && (
              <div className="p-4 mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold">First Name</Label>
                  <Input id="firstName" placeholder="Jane" {...register("firstName")} className="h-10 rounded-xl" />
                  {errors.firstName && <p className="text-[11px] text-rose-500 font-medium">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold">Last Name</Label>
                  <Input id="lastName" placeholder="Smith" {...register("lastName")} className="h-10 rounded-xl" />
                  {errors.lastName && <p className="text-[11px] text-rose-500 font-medium">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">Guest Email Address</Label>
                <Input id="email" type="email" placeholder="jane@company.com" {...register("email")} className="h-10 rounded-xl" />
                {errors.email && <p className="text-[11px] text-rose-500 font-medium">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="businessName" className="text-xs font-semibold">Company Name (Optional)</Label>
                  <Input id="businessName" placeholder="Smith Consulting" {...register("businessName")} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="industry" className="text-xs font-semibold">Industry (Optional)</Label>
                  <Input id="industry" placeholder="Financial Advisory" {...register("industry")} className="h-10 rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="visitDate" className="text-xs font-semibold">Meeting Date</Label>
                <Input id="visitDate" type="date" {...register("visitDate")} className="h-10 rounded-xl" />
                {errors.visitDate && <p className="text-[11px] text-rose-500 font-medium">{errors.visitDate.message}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md cursor-pointer mt-2"
              >
                {isSubmitting ? "Sending Invitation..." : "Send Visitor Invitation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Registered Chapter Visitors List */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" /> Chapter Visitors Roster
            </CardTitle>
            <CardDescription className="text-xs">
              Recent visitors registered for upcoming meetings
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">Loading visitors...</div>
            ) : invitedVisitors.length > 0 ? (
              <div className="divide-y text-xs">
                {invitedVisitors.map((vis) => (
                  <div key={vis.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div>
                      <h5 className="font-bold text-foreground">{vis.firstName} {vis.lastName}</h5>
                      <p className="text-[11px] text-muted-foreground">{vis.email} • {vis.company || "Guest"}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      vis.status === "ATTENDED"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                    }`}>
                      {vis.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No visitors registered yet. Use the form to invite your first guest!
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

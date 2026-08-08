"use client";

import * as React from "react";
import { MemberDashboard } from "../components/member-dashboard";
import { MemberProfileForm } from "@/features/members/components/member-profile-form";
import { MemberReferralsTable } from "@/features/referrals/components/member-referrals-table";
import { MemberVisitorsMeetings } from "@/features/visitors/components/member-visitors-meetings";
import { LayoutDashboard, UserCheck, Handshake, CalendarDays } from "lucide-react";

export default function MemberWorkspacePage() {
  const [activeTab, setActiveTab] = React.useState<"overview" | "profile" | "referrals" | "visitors">("overview");

  return (
    <div className="space-y-6">
      {/* Workspace Header Nav Tabs */}
      <div className="flex items-center gap-2 border-b pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Business Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("referrals")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "referrals"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Handshake className="h-4 w-4" />
          <span>My Referrals</span>
        </button>

        <button
          onClick={() => setActiveTab("visitors")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "visitors"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>Visitors & Meetings</span>
        </button>
      </div>

      {/* Tab Content View */}
      <div className="pt-2 animate-in fade-in duration-200">
        {activeTab === "overview" && <MemberDashboard onNavigateTab={setActiveTab} />}
        {activeTab === "profile" && <MemberProfileForm />}
        {activeTab === "referrals" && <MemberReferralsTable />}
        {activeTab === "visitors" && <MemberVisitorsMeetings />}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Users, TrendingUp, Sparkles, CheckCircle2, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-background pt-8 pb-20 sm:pb-32 lg:pb-36">
      {/* Dynamic Animated Background Gradients & Glow Orbs */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-600 via-primary to-emerald-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse duration-10000"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-4 sm:pt-10">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl space-y-6">
          
          {/* Top Badge (Clean & High-End, No "White Labeling" mention) */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-primary/10 to-emerald-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20 backdrop-blur-md hover:ring-primary/40 transition-all shadow-sm">
            <Zap className="h-4 w-4 text-indigo-500 fill-indigo-500/20" />
            <span>The #1 Referral Networking Engine for Business Chapters</span>
          </div>

          {/* Main Headline (Ultra-Rich Typography & Glowing Gradients) */}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.15] sm:leading-[1.12] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Transform Connections Into{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-primary to-emerald-400 drop-shadow-sm">
              Predictable Revenue
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto font-normal animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Streamline chapter operations, log 1-to-1 meetings, track verified referrals, and measure closed business with enterprise accuracy and real-time analytics.
          </p>

          {/* Action Buttons (Arrow icon strictly inline with text) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Button 
              size="lg" 
              asChild 
              className="w-full sm:w-auto h-13 px-8 text-base font-semibold bg-gradient-to-r from-indigo-600 via-primary to-indigo-600 hover:from-indigo-500 hover:to-primary text-white shadow-xl hover:shadow-indigo-500/30 transition-all rounded-2xl cursor-pointer"
            >
              <Link href="/register" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <span>Start Networking Now</span>
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="w-full sm:w-auto h-13 px-8 text-base font-semibold border-border/80 hover:bg-muted/60 transition-all rounded-2xl"
            >
              <Link href="/chapters" className="inline-flex items-center justify-center whitespace-nowrap">
                Explore Chapters
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Multi-Tenant Security</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Real-Time Traffic Lights</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Automated Dues & Attendance</span>
            </div>
          </div>

        </div>

        {/* Dynamic Mockup & Floating Metric Cards */}
        <div className="relative mt-16 sm:mt-24 lg:mt-28">
          
          {/* Floating Metric Card 1 (Left Top) */}
          <div className="hidden md:flex absolute -top-8 -left-6 lg:left-4 z-20 items-center gap-4 rounded-2xl bg-background/95 p-4 shadow-2xl border border-border/80 backdrop-blur-xl animate-bounce-slow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Closed Business</p>
              <p className="text-xl font-extrabold text-foreground">$14.8M+</p>
              <span className="text-[11px] text-emerald-500 font-medium">↑ +28% this month</span>
            </div>
          </div>

          {/* Floating Metric Card 2 (Right Bottom) */}
          <div className="hidden md:flex absolute -bottom-8 -right-6 lg:right-4 z-20 items-center gap-4 rounded-2xl bg-background/95 p-4 shadow-2xl border border-border/80 backdrop-blur-xl animate-bounce-slow delay-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Active Members</p>
              <p className="text-xl font-extrabold text-foreground">12,450+</p>
              <span className="text-[11px] text-indigo-500 font-medium">Across 180+ Chapters</span>
            </div>
          </div>

          {/* Dashboard Preview Mockup Container */}
          <div className="rounded-3xl bg-gradient-to-b from-border/90 via-border/50 to-transparent p-2 sm:p-3 shadow-2xl backdrop-blur-md">
            <div className="rounded-2xl overflow-hidden border border-border/60 bg-slate-950 shadow-inner">
              {/* Header Bar */}
              <div className="flex h-10 items-center justify-between px-4 border-b border-slate-800/80 bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-medium text-slate-400">growcle.app/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Live Chapter Feed</span>
                </div>
              </div>

              {/* Mock Interface Content */}
              <div className="p-6 sm:p-8 bg-slate-950 text-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stat Tile 1 */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
                    <span>Passed Referrals</span>
                    <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full text-[10px]">This Quarter</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">4,892</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[82%]" />
                  </div>
                </div>

                {/* Stat Tile 2 */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
                    <span>Completed 1-to-1s</span>
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">Active</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">1,340</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[68%]" />
                  </div>
                </div>

                {/* Stat Tile 3 */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
                    <span>Chapter Traffic Light Score</span>
                    <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px]">Green Zone</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white">96.4</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[96%]" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

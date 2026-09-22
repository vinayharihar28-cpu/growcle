import Link from "next/link";
import { Users, TrendingUp, ShieldCheck, CheckCircle2, Star, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/shared/components/theme-toggle";

import { GrowcleLogo } from "@/shared/components/brand/growcle-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground transition-colors selection:bg-indigo-500/30">
      
      {/* Left Column: Split-Screen Marketing Showcase (Hidden on Mobile, Visible on LG screens) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border-r border-border/40 overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Brand Logo (Only one Growcle on desktop) */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center group">
            <GrowcleLogo size={36} textColor="text-white text-2xl font-extrabold" />
          </Link>
        </div>

        {/* Middle Content: Platform Highlights */}
        <div className="relative z-10 space-y-6 my-auto py-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Enterprise White-Label Platform
            </span>
            <h2 className="text-2xl xl:text-3xl font-extrabold text-white leading-tight">
              Scale Your Chapter&apos;s Referral Network With Precision
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track 1-to-1 meetings, log passed referrals, automate visitor registrations, and measure total closed revenue in real time.
            </p>
          </div>

          {/* Floating Metric Card Preview */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Verified Network Impact</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+34% YoY</span>
            </div>
            <div className="text-2xl font-extrabold text-white">₹14.8 Cr+</div>
            <p className="text-xs text-slate-400">Total closed business recorded across member chapters.</p>
          </div>

          {/* Social Proof Quote */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic">
              &ldquo;Growcle eliminated hours of weekly chapter admin work and made revenue tracking seamless.&rdquo;
            </p>
            <p className="text-[11px] font-semibold text-indigo-300">
              — Marcus Vance, Metro Chapter President
            </p>
          </div>
        </div>

        {/* Bottom Footer note */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Growcle SaaS</span>
          <Link href="/" className="hover:text-white transition-colors">Platform Home</Link>
        </div>

      </div>

      {/* Right Column: Form Container with Screen Mode Switcher */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-4 sm:p-8 lg:p-10 relative overflow-y-auto min-h-screen">
        
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between z-20 pb-2">
          {/* Logo is ONLY rendered on Mobile (lg:hidden) to avoid duplicate "Growcle" on Desktop */}
          <Link href="/" className="lg:hidden inline-flex items-center group">
            <GrowcleLogo size={32} textColor="text-foreground text-lg font-extrabold" />
          </Link>
          
          {/* Invisible spacer on desktop to push theme toggle to the right */}
          <div className="hidden lg:block"></div>

          <div className="flex items-center gap-3">
            {/* Screen Mode Toggle: Light / Dark / System */}
            <ThemeToggle 
              variant="switch" 
              className="bg-card/80 backdrop-blur-md" 
            />
            
            <Link 
              href="/" 
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Center Container for Auth Form */}
        <div className="w-full max-w-xl mx-auto my-auto py-2">
          {children}
        </div>

        {/* Bottom copyright on right column for mobile */}
        <div className="w-full text-center text-xs text-muted-foreground pt-2">
          <span>Protected by Growcle Enterprise Security.</span>
        </div>

      </div>

    </div>
  );
}

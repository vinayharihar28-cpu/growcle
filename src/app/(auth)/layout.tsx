import Link from "next/link";
import { Users, TrendingUp, ShieldCheck, CheckCircle2, Star } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      
      {/* Left Column: Split-Screen Marketing Showcase (Hidden on Mobile, Visible on LG screens) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-r border-slate-800/80 overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Brand Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white font-extrabold text-xl shadow-lg group-hover:scale-105 transition-transform">
              G
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Growcle
            </span>
          </Link>
        </div>

        {/* Middle Content: Platform Highlights */}
        <div className="relative z-10 space-y-8 my-auto py-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Enterprise White-Label Platform
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Scale Your Chapter&apos;s Referral Network With Precision
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track 1-to-1 meetings, log passed referrals, automate visitor registrations, and measure total closed revenue in real time.
            </p>
          </div>

          {/* Floating Metric Card Preview */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Verified Network Impact</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+34% YoY</span>
            </div>
            <div className="text-2xl font-extrabold text-white">$14,800,000+</div>
            <p className="text-xs text-slate-400">Total closed business recorded across member chapters.</p>
          </div>

          {/* Social Proof Quote */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
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
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Growcle SaaS</span>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
        </div>

      </div>

      {/* Right Column: Form Container (Full Width on Mobile, 7 cols on LG) */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden absolute top-6 left-6">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              G
            </div>
            <span className="font-bold text-lg text-white">Growcle</span>
          </Link>
        </div>

        <div className="w-full max-w-lg mt-8 lg:mt-0">
          {children}
        </div>
      </div>

    </div>
  );
}

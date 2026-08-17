import { MarketingNavbar } from "@/features/marketing/components/marketing-navbar";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { FeaturesGrid } from "@/features/marketing/components/features-grid";
import { TestimonialsCarousel } from "@/features/marketing/components/testimonials-carousel";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, CheckCircle2, Rocket, ShieldCheck, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <MarketingNavbar />
      
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Features Grid */}
        <FeaturesGrid />

        {/* 3. Testimonials Carousel */}
        <TestimonialsCarousel />

        {/* 4. Completely Redesigned High-Converting Call to Action Section */}
        <section className="relative py-20 sm:py-32 px-6 lg:px-8 bg-slate-950 overflow-hidden">
          {/* Ambient Radial Mesh Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-primary/15 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          <div className="mx-auto max-w-5xl relative z-10">
            {/* Glassmorphic Container Card with Gradient Border */}
            <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800/90 p-8 sm:p-14 md:p-16 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              
              {/* Inner Decorative Accent Ring */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="mx-auto max-w-3xl text-center space-y-6">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-300 border border-indigo-500/20 shadow-sm">
                  <Rocket className="h-4 w-4 text-indigo-400" />
                  <span>Launch Your Chapter Profile in &lt; 5 Minutes</span>
                </div>

                {/* Headline */}
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                  Ready to Accelerate Your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-400">
                    Chapter&apos;s Growth?
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  Join thousands of business leaders generating millions in closed business. Supercharge your referral pipeline today.
                </p>

                {/* Action Buttons with Strictly Inline Arrow Icons */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    asChild 
                    className="w-full sm:w-auto h-13 px-8 text-base font-semibold bg-gradient-to-r from-indigo-600 via-primary to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-xl hover:shadow-indigo-500/25 transition-all rounded-2xl cursor-pointer"
                  >
                    <Link href="/register" className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap">
                      <span>Register as Visitor</span>
                      <ArrowRight className="h-5 w-5 shrink-0" />
                    </Link>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg" 
                    asChild 
                    className="w-full sm:w-auto h-13 px-8 text-base font-semibold border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white transition-all rounded-2xl"
                  >
                    <Link href="/login" className="inline-flex items-center justify-center whitespace-nowrap">
                      Member Sign In
                    </Link>
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="pt-8 border-t border-slate-800/80 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs sm:text-sm text-slate-400">
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Free Chapter Trial</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> No credit card required</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Instant Setup</span>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      {/* 5. Comprehensive Footer */}
      <MarketingFooter />
    </div>
  );
}

import { MarketingNavbar } from "@/features/marketing/components/marketing-navbar";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { ShieldCheck, Target, Users, Award, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

const leadershipTeam = [
  {
    name: "David Sterling",
    role: "Co-Founder & CEO",
    bio: "Former chapter director with 15+ years in enterprise SaaS and referral network scaling.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
  },
  {
    name: "Dr. Elena Rostova",
    role: "Chief Product Officer",
    bio: "Pioneer in organizational behavior and digital networking metrics.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  },
  {
    name: "Michael Chen",
    role: "Head of Chapter Operations",
    bio: "Scaled local networking chapters from 50 members to over 10,000 active global participants.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative py-20 sm:py-28 bg-muted/20 border-b border-border/40 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20 mb-6">
              Empowering Business Communities
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
              Our Mission to Transform <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-primary to-indigo-400">
                Business Networking
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              We build structured, technology-driven platforms that turn word-of-mouth recommendations into measurable, high-growth revenue engines for professionals worldwide.
            </p>
          </div>
        </section>

        {/* Mission & Core Values */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="p-8 rounded-3xl bg-background border border-border/60 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Structured Integrity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We believe true networking success stems from accountability, verified referral pipelines, and clear performance tracking.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-background border border-border/60 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Community First</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every chapter is built on mutual benefit and trusted relationships. We design tools that elevate member connections.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-background border border-border/60 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">White-Label Flexibility</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Designed from the ground up to be organization-agnostic, supporting multi-tenancy and custom brand identities seamlessly.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section id="team" className="py-20 sm:py-28 bg-muted/20 border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 space-y-3">
              <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-wide">
                Leadership
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Meet the team driving platform innovation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadershipTeam.map((member) => (
                <div key={member.name} className="rounded-3xl bg-background border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-64 overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm font-semibold text-primary">{member.role}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-2">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Chat Readiness Notice (Future Feature) */}
        <section className="py-16 bg-background border-t border-border/40">
          <div className="mx-auto max-w-4xl px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              <MessageSquare className="h-4 w-4" /> Live Support Integration Coming Soon
            </div>
            <h3 className="text-2xl font-bold text-foreground">Have questions before joining?</h3>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Our team is ready to walk you through chapter onboarding or custom enterprise deployments.
            </p>
            <div className="pt-2">
              <Button asChild className="rounded-xl px-6">
                <Link href="/contact">
                  Get in Touch with Sales <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

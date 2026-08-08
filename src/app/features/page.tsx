import { MarketingNavbar } from "@/features/marketing/components/marketing-navbar";
import { Handshake, MessagesSquare, Banknote, Target, LineChart, Building, ShieldCheck, Zap, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

const detailedFeatures = [
  {
    name: "Structured Referral System",
    description: "Digitally pass warm referrals to other members. Track the conversion pipeline from initial introduction to closed revenue deal, removing paperwork completely.",
    icon: Handshake,
    badge: "Core"
  },
  {
    name: "1-to-1 Collaboration Logger",
    description: "Plan, schedule, and document official one-on-one business discussions. De-silo contacts by recording key collaboration topics and synergies.",
    icon: MessagesSquare,
    badge: "Engagement"
  },
  {
    name: "TYFCB (Thank You For Closed Business)",
    description: "Accurately log closed revenue generated through chapter referrals. Prove the hard ROI of your membership dues with clear financial dashboards.",
    icon: Banknote,
    badge: "ROI"
  },
  {
    name: "Goal Monitoring (PALMS Metrics)",
    description: "Align chapter objectives with metrics for Attendance, Referrals, Visitors, and 1-to-1s. Use traffic-light indicators to ensure optimal engagement.",
    icon: Target,
    badge: "Gamification"
  },
  {
    name: "Granular Analytics Engines",
    description: "Evaluate personal and chapter performance over custom timeframes. Export PDF/Excel scorecards for performance reviews and strategic planning.",
    icon: LineChart,
    badge: "Analytics"
  },
  {
    name: "Chapter Governance Center",
    description: "Equip leadership teams with roster control, attendance reporting, automated agenda generation, meeting history logs, and dues collections.",
    icon: Building,
    badge: "Leadership"
  },
  {
    name: "Role-Based Access Control",
    description: "Delegate administrative roles (President, VP, Secretary, Member) with custom permissions. Protect sensitive financial data and roster privacy.",
    icon: ShieldCheck,
    badge: "Security"
  },
  {
    name: "Automated Notifications",
    description: "Get real-time push alerts and email notifications for passed referrals, meeting schedules, and upcoming chapter gatherings.",
    icon: Zap,
    badge: "Automation"
  },
  {
    name: "Enterprise Custom Branding",
    description: "Deploy unique subdomains, custom logos, colors, and white-label branding tailored for regional networks and corporate organizations.",
    icon: Award,
    badge: "White-Label"
  }
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 bg-muted/10">
          <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_50%_-10rem,var(--color-primary-foreground),transparent)] opacity-10" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-3xl mx-auto">
              Engineered to Accelerate <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Local Networking</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Discover the enterprise-grade tools built to transform business relationships into mathematically verifiable business revenue.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 sm:py-32 container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedFeatures.map((feat) => (
              <div 
                key={feat.name}
                className="flex flex-col justify-between bg-card hover:bg-muted/10 p-8 rounded-2xl border transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <feat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feat.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="bg-primary px-6 py-20 sm:py-28 text-center text-primary-foreground">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to transform your network?</h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Get registered as a visitor at your nearest local chapter and start building relationships today.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/chapters">Find a Chapter</Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/register">Register to Visit</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Growcle White-Label SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

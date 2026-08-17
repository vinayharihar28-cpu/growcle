"use client";

import { Handshake, MessagesSquare, Banknote, Target, LineChart, Building, ShieldCheck, Zap, Layers } from "lucide-react";

const features = [
  {
    name: "Digital Referral Pipeline",
    description: "Pass warm referrals to chapter members instantly. Monitor stage progress from initial contact to closed revenue with verified audit trails.",
    icon: Handshake,
    badge: "Core Engine",
  },
  {
    name: "Structured 1-to-1 Meetings",
    description: "Schedule, log, and document strategic 1-to-1 networking sessions to deepen business trust and identify cross-selling opportunities.",
    icon: MessagesSquare,
    badge: "Relationship Builder",
  },
  {
    name: "Closed Business Revenue Tracking",
    description: "Log 'Thank You For Closed Business' (TYFCB) to mathematically measure return on membership investment and network velocity.",
    icon: Banknote,
    badge: "Verified ROI",
  },
  {
    name: "Chapter Goals & Traffic Lights",
    description: "Set chapter-wide targets for visitor conversion, referrals passed, and revenue. Real-time traffic lights highlight top contributors.",
    icon: Target,
    badge: "Gamified Growth",
  },
  {
    name: "Executive Member Analytics",
    description: "Interactive dashboard metrics showing your individual performance, top referral sources, and network lifetime value.",
    icon: LineChart,
    badge: "Data Intelligence",
  },
  {
    name: "Automated Chapter Operations",
    description: "Empower chapter leadership to automate meeting agendas, attendance check-ins via QR, roster updates, and automated dues billing.",
    icon: Building,
    badge: "Zero Friction",
  },
  {
    name: "Enterprise Multi-Tenancy",
    description: "Support unlimited independent business networking organizations, regions, and chapters under customized white-label domains.",
    icon: Layers,
    badge: "Scalable Architecture",
  },
  {
    name: "Granular RBAC & Permissions",
    description: "Role-based access control protecting chapter data, ensuring members, chapter officers, and regional admins access appropriate tools.",
    icon: ShieldCheck,
    badge: "Enterprise Security",
  },
  {
    name: "Real-Time Notifications",
    description: "Instant push notifications, email alerts, and meeting reminders powered by Firebase FCM and Resend integration.",
    icon: Zap,
    badge: "Instant Sync",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/20 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <h2 className="text-base font-semibold leading-7 text-primary tracking-wide uppercase">
            Engineered For Exponential Growth
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Everything your chapter needs to turn networking into a revenue machine
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground pt-2">
            Built with modern architecture to eliminate administrative friction and provide total clarity into referral performance.
          </p>
        </div>

        {/* Features Cards Grid */}
        <div className="mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="group relative flex flex-col justify-between rounded-3xl bg-background p-8 border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 overflow-hidden"
              >
                {/* Accent Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border/50 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {feature.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

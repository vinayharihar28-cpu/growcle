import { Handshake, MessagesSquare, Banknote, Target, LineChart, Building } from "lucide-react";

const features = [
  {
    name: "Track Referrals",
    description: "Digitally pass referrals to other members and track their status from warm lead to closed business.",
    icon: Handshake,
  },
  {
    name: "1-to-1 Meetings",
    description: "Schedule and log 1-to-1 networking meetings to build deeper relationships with chapter members.",
    icon: MessagesSquare,
  },
  {
    name: "Revenue Tracking",
    description: "Log 'Thank You For Closed Business' (TYFCB) to mathematically prove the ROI of your network.",
    icon: Banknote,
  },
  {
    name: "Chapter Goals",
    description: "Set chapter-wide goals for visitors, referrals, and revenue. Monitor progress with real-time traffic lights.",
    icon: Target,
  },
  {
    name: "Member Analytics",
    description: "Get detailed analytics on your networking performance. See exactly how much revenue you are generating.",
    icon: LineChart,
  },
  {
    name: "Automated Chapter Management",
    description: "Leadership teams can manage rosters, attendance, meeting agendas, and dues collection in one place.",
    icon: Building,
  },
];

export function FeaturesGrid() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Grow Faster Together</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to build a powerful referral network
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform provides the structure, tools, and analytics required to turn casual networking into a predictable engine for business growth.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <feature.icon className="h-5 w-5 flex-none" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

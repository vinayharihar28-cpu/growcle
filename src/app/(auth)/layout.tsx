import { Users, Share2, Globe, Sparkles, Network } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Mesh Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      {/* Radial ambient glow blobs */}
      <div className="absolute -left-1/4 -top-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute -right-1/4 -bottom-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Floating Networking/Collaboration Themed Icons */}
      <div className="absolute top-10 left-10 md:top-20 md:left-24 text-indigo-500/20 animate-bounce duration-5000">
        <Users className="w-12 h-12 md:w-16 md:h-16" />
      </div>
      <div className="absolute bottom-12 left-12 md:bottom-28 md:left-32 text-violet-500/20 animate-pulse">
        <Share2 className="w-10 h-10 md:w-12 md:h-12" />
      </div>
      <div className="absolute top-16 right-16 md:top-32 md:right-36 text-indigo-500/20 animate-pulse">
        <Network className="w-12 h-12 md:w-14 md:h-14" />
      </div>
      <div className="absolute bottom-16 right-10 md:bottom-24 md:right-28 text-violet-500/20 animate-bounce duration-3000">
        <Globe className="w-10 h-10 md:w-16 md:h-16" />
      </div>
      <div className="absolute top-1/2 left-6 md:left-12 -translate-y-1/2 text-indigo-500/10 hidden sm:block">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}


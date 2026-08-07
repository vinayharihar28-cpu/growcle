import { MarketingNavbar } from "@/features/marketing/components/marketing-navbar";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { FeaturesGrid } from "@/features/marketing/components/features-grid";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesGrid />
        
        {/* Call to Action Section */}
        <div className="bg-primary px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to accelerate your growth?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
              Join thousands of professionals generating millions in closed business through our structured referral networking platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/register"
                className="rounded-md bg-background px-3.5 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
              >
                Get started today
              </a>
              <a href="/login" className="text-sm font-semibold leading-6 text-primary-foreground">
                Sign in to your account <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Growcle White-Label SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

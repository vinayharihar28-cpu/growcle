import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Globe, Users, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground">
                <span>Just shipped v1.0</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Accelerate Your Business Growth Through Trusted Referrals
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Join the world's leading business networking platform. Track 1-to-1s, pass referrals, measure closed business, and scale your professional network inside local chapters.
          </p>
          <div className="mt-10 flex items-center gap-x-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all">
              <Link href="/auth/register">
                Start Networking <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="h-12 px-8 text-base">
              <Link href="#directory">
                Find a Chapter
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image / Mockup Area */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="relative rounded-xl bg-muted/5 p-2 ring-1 ring-inset ring-foreground/10 lg:-m-4 lg:rounded-2xl lg:p-4 animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="rounded-md shadow-2xl ring-1 ring-foreground/10 flex flex-col overflow-hidden bg-background">
                {/* Mockup Top Bar */}
                <div className="flex h-10 w-[48rem] items-center gap-2 border-b bg-muted/50 px-4">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                {/* Mockup Content */}
                <div className="p-8 grid grid-cols-2 gap-4 bg-muted/10 h-[32rem]">
                   <div className="space-y-4">
                      <div className="h-8 w-3/4 bg-primary/20 rounded animate-pulse" />
                      <div className="h-24 w-full bg-background border rounded-lg shadow-sm p-4 flex flex-col justify-center">
                         <div className="flex items-center gap-3">
                            <TrendingUp className="h-8 w-8 text-emerald-500" />
                            <div>
                               <div className="text-sm text-muted-foreground">Closed Business</div>
                               <div className="text-2xl font-bold">$1.2M</div>
                            </div>
                         </div>
                      </div>
                      <div className="h-24 w-full bg-background border rounded-lg shadow-sm p-4 flex flex-col justify-center">
                         <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                               <div className="text-sm text-muted-foreground">Referrals Passed</div>
                               <div className="text-2xl font-bold">428</div>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="border rounded-lg bg-background p-4 shadow-sm">
                      <div className="h-6 w-1/2 bg-muted rounded mb-4" />
                      <div className="space-y-3">
                         {[1,2,3,4,5].map(i => (
                           <div key={i} className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                             <div className="space-y-2 flex-1">
                               <div className="h-3 w-3/4 bg-muted rounded" />
                               <div className="h-3 w-1/2 bg-muted/50 rounded" />
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-primary opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { Menu } from "lucide-react";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8 mx-auto">
        
        {/* Brand */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-primary-foreground">G</span>
            </div>
            <span className="font-bold inline-block">Growcle</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#directory" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Find a Chapter
            </Link>
            <Link href="#pricing" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary/90 hover:bg-primary">
              <Link href="/auth/register">Get Started</Link>
            </Button>
            
            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden ml-2">
              <Menu className="h-5 w-5" />
            </Button>
          </nav>
        </div>
        
      </div>
    </header>
  );
}

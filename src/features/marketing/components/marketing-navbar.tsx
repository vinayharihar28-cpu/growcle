"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8 mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-primary to-indigo-400 shadow-md group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-primary-foreground text-lg">G</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
              Growcle
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
            <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="/chapters" className="text-muted-foreground transition-colors hover:text-foreground">
              Find a Chapter
            </Link>
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link href="/showcase" className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-0.5">
              Showcase <ArrowUpRight className="h-3 w-3 opacity-60" />
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <nav className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" asChild className="font-medium">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-all rounded-xl">
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
          
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/40 bg-background/98 px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 font-medium text-base">
            <Link 
              href="/#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Features
            </Link>
            <Link 
              href="/chapters" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Find a Chapter
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Contact
            </Link>
            <Link 
              href="/showcase" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center justify-between"
            >
              <span>Showcase</span>
              <ArrowUpRight className="h-4 w-4 opacity-60" />
            </Link>
          </nav>

          <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
            <Button variant="outline" asChild className="w-full justify-center rounded-xl">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
            </Button>
            <Button asChild className="w-full justify-center rounded-xl bg-primary text-primary-foreground">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}


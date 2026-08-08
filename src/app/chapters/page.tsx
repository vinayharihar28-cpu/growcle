"use client";

import { MarketingNavbar } from "@/features/marketing/components/marketing-navbar";
import { useState, useEffect } from "react";
import { getChapters } from "@/features/chapter/actions/chapter";
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface ChapterItem {
  id: string;
  name: string;
  organization: {
    name: string;
  } | null;
}

export default function ChaptersDirectoryPage() {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await getChapters();
        setChapters(list);
      } catch (e) {
        console.error("Failed to load chapters", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredChapters = chapters.filter((ch) => {
    const searchString = `${ch.name} ${ch.organization?.name || ""}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="py-20 text-center bg-muted/10 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Find a Local <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Chapter</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse structured business referral groups in your region. Register to attend a weekly meeting as a visitor.
            </p>

            {/* Search Input Container */}
            <div className="mt-10 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search by chapter name or organization..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </section>

        {/* Chapters List */}
        <section className="py-16 container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground font-semibold">Loading chapter directory...</p>
            </div>
          ) : filteredChapters.length === 0 ? (
            <div className="text-center py-20 border rounded-2xl bg-muted/5">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground">No chapters found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your keywords or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredChapters.map((ch) => (
                <div 
                  key={ch.id}
                  className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      {ch.organization?.name || "Independent"}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-4 mb-4">{ch.name}</h3>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-indigo-500" />
                        <span>Chapter Conference Room</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span>Every Thursday at 7:00 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t">
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 rounded-xl shadow cursor-pointer group" 
                      asChild
                    >
                      <Link href={`/register?chapterId=${ch.id}`}>
                        Register to Visit <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

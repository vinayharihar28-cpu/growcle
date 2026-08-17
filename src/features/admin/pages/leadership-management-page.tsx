'use client';

import { useState, useEffect } from 'react';
import { LeadershipAssignment } from '@/types/admin';
import { AdminService } from '@/features/admin/services/admin-service';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Search, GraduationCap, Building2, UserCircle, Edit3, UserPlus, Filter } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export function LeadershipManagementPage() {
  const [assignments, setAssignments] = useState<LeadershipAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeadership();
  }, []);

  const fetchLeadership = () => {
    setLoading(true);
    AdminService.getLeadership().then((data) => {
      setAssignments(data);
      setLoading(false);
    });
  };

  const filteredAssignments = assignments.filter(a => 
    a.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.president?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.vicePresident?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.treasurer?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-2 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-500" /> Leadership Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the Leadership Team (President, VP, Treasurer) for each chapter.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by chapter or leader name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border rounded-xl bg-card text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>
        <div className="flex gap-2">
          <select className="border rounded-xl bg-card text-sm px-3 py-2 outline-hidden text-muted-foreground">
            <option>All Regions</option>
            <option>West Coast</option>
            <option>East Coast</option>
          </select>
          <Button variant="outline" className="h-10 text-xs px-3"><Filter className="w-4 h-4 mr-1" /> Filters</Button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : (
          filteredAssignments.map(assignment => (
            <div key={assignment.chapterId} className="border rounded-2xl bg-card shadow-xs overflow-hidden">
              <div className="bg-muted/30 p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <Link href={`/dashboard/chapters/${assignment.chapterId}`} className="font-bold text-foreground text-sm hover:underline hover:text-indigo-600">
                      {assignment.chapterName}
                    </Link>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Chapter ID: {assignment.chapterId}</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-8">
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Assign Leadership
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                
                {/* President */}
                <div className="p-5 flex flex-col gap-3 hover:bg-accent/20 transition-colors group">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                    President
                  </div>
                  {assignment.president ? (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{assignment.president.name}</div>
                        <div className="text-xs text-muted-foreground">{assignment.president.email}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-10 border border-dashed rounded-lg text-muted-foreground text-xs cursor-pointer hover:bg-accent hover:text-foreground transition-colors">
                      <UserPlus className="w-3.5 h-3.5 mr-1" /> Assign
                    </div>
                  )}
                </div>

                {/* Vice President */}
                <div className="p-5 flex flex-col gap-3 hover:bg-accent/20 transition-colors group">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                    Vice President
                  </div>
                  {assignment.vicePresident ? (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{assignment.vicePresident.name}</div>
                        <div className="text-xs text-muted-foreground">{assignment.vicePresident.email}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-10 border border-dashed rounded-lg text-muted-foreground text-xs cursor-pointer hover:bg-accent hover:text-foreground transition-colors">
                      <UserPlus className="w-3.5 h-3.5 mr-1" /> Assign
                    </div>
                  )}
                </div>

                {/* Secretary/Treasurer */}
                <div className="p-5 flex flex-col gap-3 hover:bg-accent/20 transition-colors group">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                    Secretary / Treasurer
                  </div>
                  {assignment.treasurer ? (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{assignment.treasurer.name}</div>
                        <div className="text-xs text-muted-foreground">{assignment.treasurer.email}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-10 border border-dashed rounded-lg text-muted-foreground text-xs cursor-pointer hover:bg-accent hover:text-foreground transition-colors">
                      <UserPlus className="w-3.5 h-3.5 mr-1" /> Assign
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          ))
        )}
        
        {!loading && filteredAssignments.length === 0 && (
          <div className="p-12 text-center border rounded-2xl bg-card border-dashed">
            <h3 className="text-lg font-bold text-foreground">No Assignments Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              No leadership assignments match your search criteria.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

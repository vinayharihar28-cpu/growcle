'use client';

import { useState, useEffect } from 'react';
import { AdminDirector } from '@/types/admin';
import { AdminService } from '@/features/admin/services/admin-service';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Briefcase, Search, UserPlus, Filter, ShieldCheck, Mail, Calendar, Eye, Settings, Building } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function DirectorsListPage() {
  const [directors, setDirectors] = useState<AdminDirector[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = () => {
    setLoading(true);
    AdminService.getDirectors().then((data) => {
      setDirectors(data);
      setLoading(false);
    });
  };

  const filteredDirectors = directors.filter(d => 
    d.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-2 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-500" /> Director Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage platform Directors and assign them to oversee chapters.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-xs font-semibold">
            <Mail className="w-4 h-4 mr-1.5" /> Invite Director
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
            <UserPlus className="w-4 h-4 mr-1.5" /> Add Director
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search directors by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border rounded-xl bg-card text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>
        <div className="flex gap-2">
          <select className="border rounded-xl bg-card text-sm px-3 py-2 outline-hidden text-muted-foreground">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <Button variant="outline" className="h-10 text-xs px-3"><Filter className="w-4 h-4 mr-1" /> Filters</Button>
        </div>
      </div>

      {/* List */}
      <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-4">Director Info</th>
                  <th className="p-4">Assigned Chapters</th>
                  <th className="p-4">Status & Activity</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDirectors.map(director => (
                  <tr key={director.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-foreground text-sm">{director.firstName} {director.lastName}</div>
                      <div className="text-muted-foreground">{director.email}</div>
                      <div className="text-[10px] font-semibold text-indigo-600 mt-1">{director.roleName}</div>
                    </td>
                    <td className="p-4">
                      {director.assignedChapters.length > 0 ? (
                        <div className="space-y-1">
                          {director.assignedChapters.map(chap => (
                            <div key={chap.id} className="flex items-center gap-1.5 text-xs text-foreground bg-muted/40 px-2 py-1 rounded-md inline-flex mr-1 mb-1">
                              <Building className="w-3 h-3 text-muted-foreground" /> {chap.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-[10px]">No chapters assigned</span>
                      )}
                      <div className="mt-2">
                        <Button variant="link" className="p-0 h-auto text-[10px] text-indigo-600 font-bold">
                          + Assign Chapter
                        </Button>
                      </div>
                    </td>
                    <td className="p-4 space-y-2">
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${director.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                          {director.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Last Active: {new Date(director.lastActivity).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">
                      {new Date(director.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                          <Settings className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDirectors.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No directors found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

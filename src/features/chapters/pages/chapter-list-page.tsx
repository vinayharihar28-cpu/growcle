'use client';

import { useState, useEffect } from 'react';
import { ChapterDetails } from '@/types/admin';
import { AdminService } from '@/features/admin/services/admin-service';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Search, Filter, Plus, Building2, Eye, Edit } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { CreateChapterWizard } from '../components/create-chapter-wizard';
import Link from 'next/link';

export function ChapterListPage({ initialCreateOpen = false }: { initialCreateOpen?: boolean }) {
  const [chapters, setChapters] = useState<ChapterDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(initialCreateOpen);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = () => {
    setLoading(true);
    AdminService.getChapters().then((data) => {
      setChapters(data);
      setLoading(false);
    });
  };

  const filteredChapters = chapters.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-2 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-500" /> Chapter Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all active and inactive chapters across the platform.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" /> Create Chapter
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by name, code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border rounded-xl bg-card text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>
        <div className="flex gap-2">
          <select className="border rounded-xl bg-card text-sm px-3 py-2 outline-hidden text-muted-foreground">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select className="border rounded-xl bg-card text-sm px-3 py-2 outline-hidden text-muted-foreground">
            <option>All Regions</option>
            <option>West Coast</option>
            <option>East Coast</option>
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
                  <th className="p-4">Chapter & Code</th>
                  <th className="p-4">Location / Region</th>
                  <th className="p-4">Director</th>
                  <th className="p-4">Leadership</th>
                  <th className="p-4 text-center">Active Members</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredChapters.map(chapter => (
                  <tr key={chapter.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-4">
                      <Link href={`/dashboard/chapters/${chapter.id}`} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                        {chapter.name}
                      </Link>
                      <div className="text-[10px] font-medium text-muted-foreground mt-0.5">{chapter.code}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{chapter.location}</div>
                      <div className="text-[10px] text-muted-foreground">{chapter.region}</div>
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {chapter.directorName || 'Unassigned'}
                    </td>
                    <td className="p-4 text-[10px] text-muted-foreground space-y-0.5">
                      <div><span className="font-semibold">Pres:</span> {chapter.presidentName}</div>
                      <div><span className="font-semibold">VP:</span> {chapter.vicePresidentName}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-600 font-bold w-7 h-7 rounded-full">
                        {chapter.activeMembers}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${chapter.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                        {chapter.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/chapters/${chapter.id}`}>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                            <Eye className="w-3.5 h-3.5 mr-1" /> View
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredChapters.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No chapters found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateChapterWizard 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onComplete={(data) => {
          console.log('Chapter created', data);
          fetchChapters(); // mock reload
        }} 
      />
    </div>
  );
}

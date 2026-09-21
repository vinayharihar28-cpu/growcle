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
  
  // Assign chapter modal state
  const [assigningDirector, setAssigningDirector] = useState<AdminDirector | null>(null);
  const [selectedChapterName, setSelectedChapterName] = useState('Silicon Valley Founders');
  const [savingAssign, setSavingAssign] = useState(false);

  // Add director modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);

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

  const handleAssignChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningDirector || !selectedChapterName) return;
    setSavingAssign(true);
    const updated = directors.map((d) => {
      if (d.id === assigningDirector.id) {
        const existing = d.assignedChapters.some(c => c.name === selectedChapterName);
        if (!existing) {
          return {
            ...d,
            assignedChapters: [...d.assignedChapters, { id: `c-${Date.now()}`, name: selectedChapterName, region: 'Bay Area' }],
          };
        }
      }
      return d;
    });
    setDirectors(updated);
    setSavingAssign(false);
    setAssigningDirector(null);
  };

  const handleAddDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newEmail) return;
    setAdding(true);
    const newDir: any = {
      id: `dir-${Date.now()}`,
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      status: 'ACTIVE',
      assignedChapters: [],
      joinedDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    setDirectors([...directors, newDir]);
    setAdding(false);
    setIsAddOpen(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
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
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setIsAddOpen(true)}
            className="text-xs font-semibold flex-1 sm:flex-initial"
          >
            <Mail className="w-4 h-4 mr-1.5" /> Invite Director
          </Button>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex-1 sm:flex-initial"
          >
            <UserPlus className="w-4 h-4 mr-1.5" /> Add Director
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
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
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
          <select className="border rounded-xl bg-card text-sm px-3 py-2 outline-hidden text-muted-foreground flex-1 sm:flex-initial">
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
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/50 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-4 whitespace-nowrap">Director Info</th>
                  <th className="p-4 whitespace-nowrap">Assigned Chapters</th>
                  <th className="p-4 whitespace-nowrap">Status & Activity</th>
                  <th className="p-4 whitespace-nowrap">Joined Date</th>
                  <th className="p-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDirectors.map(director => (
                  <tr key={director.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-foreground text-sm">{director.firstName} {director.lastName}</div>
                      <div className="text-muted-foreground">{director.email}</div>
                      <div className="text-[10px] font-semibold text-indigo-600 mt-1">{director.roleName || 'Regional Director'}</div>
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
                        <Button 
                          variant="link" 
                          onClick={() => setAssigningDirector(director)}
                          className="p-0 h-auto text-[10px] text-indigo-600 font-bold"
                        >
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
                        Last Active: {director.lastActivity ? new Date(director.lastActivity).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">
                      {director.joinedDate ? new Date(director.joinedDate).toLocaleDateString() : '2025-01-15'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setAssigningDirector(director)}
                          className="h-7 px-2 text-[10px]"
                        >
                          <Settings className="w-3.5 h-3.5 mr-1" /> Assign
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

      {/* Assign Chapter Modal */}
      {assigningDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-card border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Assign Chapters to Director</h3>
            <p className="text-xs text-muted-foreground">
              Select chapter to place under the supervision of <strong>{assigningDirector.firstName} {assigningDirector.lastName}</strong>.
            </p>

            <form onSubmit={handleAssignChapter} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Select Chapter</label>
                <select
                  value={selectedChapterName}
                  onChange={(e) => setSelectedChapterName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                >
                  <option value="Silicon Valley Founders">Silicon Valley Founders</option>
                  <option value="Golden Gate Executives">Golden Gate Executives</option>
                  <option value="East Bay Nexus">East Bay Nexus</option>
                  <option value="Marin County Professionals">Marin County Professionals</option>
                  <option value="Peninsula Innovators">Peninsula Innovators</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAssigningDirector(null)}
                  disabled={savingAssign}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={savingAssign}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {savingAssign ? 'Saving...' : 'Confirm Assignment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Director Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-card border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Add / Invite New Director</h3>
            <p className="text-xs text-muted-foreground">
              Create an administrative profile for a Regional Director.
            </p>

            <form onSubmit={handleAddDirector} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rostova"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@growcle.app"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddOpen(false)}
                  disabled={adding}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={adding}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {adding ? 'Adding...' : 'Create Director'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

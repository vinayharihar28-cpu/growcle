"use client";

import { Search, ChevronDown, Plus, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const memberGroups = [
  {
    date: "Sunday, June 28, 2026",
    count: 4,
    members: [
      { id: 1, name: "Abhiyog", initial: "A", company: "Ganapati silk and sarees", category: "Saree", phone: "9448288520", invitedBy: "Tejas", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300" },
      { id: 2, name: "H.B.Raghavendra", initial: "H", company: "Silver collections", category: "Jewellery", phone: "9449814548", invitedBy: "Self Initiative", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300" },
      { id: 3, name: "Ramesh MM", initial: "R", company: "Professional accountant", category: "Accountant", phone: "9243021776", invitedBy: "Kishore", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300" },
    ]
  },
  {
    date: "Friday, June 12, 2026",
    count: 4,
    members: [
      { id: 4, name: "Arvind H", initial: "A", company: "Freelancer", category: "Freelancer", phone: "9535707696", invitedBy: "Kishore B S", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
      { id: 5, name: "Girish", initial: "G", company: "Savajis perfumes", category: "Perfumes", phone: "7022441092", invitedBy: "Nagesh", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300" },
    ]
  }
];

export default function MembersPage() {
  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground text-sm">Manage and track your regional chapter members.</p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="bg-background rounded-xl p-4 border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, company, or category..." 
            className="w-full bg-secondary/50 border-none text-sm rounded-l-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button className="rounded-l-none bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 px-6 h-10">Search</Button>
        </div>
        <div className="hidden md:block w-px h-10 bg-border mx-2"></div>
        <div className="w-full md:w-auto flex items-center justify-between border rounded-lg px-4 py-1.5 cursor-pointer hover:bg-secondary/20 min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-full text-primary">
              <Filter className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">Active Filters</p>
              <p className="font-semibold text-primary leading-tight">All Chapters</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-6">
        {memberGroups.map((group, index) => (
          <div key={index} className="bg-background border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary/30 p-4 border-b flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-bold">{group.date}</h3>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{group.count} members</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-background border-b">
                  <tr>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Company</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Invited By</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {group.members.map((member) => (
                    <tr key={member.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${member.color}`}>
                          {member.initial}
                        </div>
                        <span className="font-semibold text-foreground">{member.name}</span>
                      </td>
                      <td className="p-4 text-muted-foreground">{member.company}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-secondary text-secondary-foreground">
                          {member.category}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{member.phone}</td>
                      <td className="p-4 text-muted-foreground">{member.invitedBy}</td>
                      <td className="p-4 text-right">
                        {/* Actions placeholder */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-blue-200 dark:border-blue-900 border-2 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Total Members</h3>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-5xl font-bold">1,284</span>
              <span className="text-sm font-bold text-green-600">+12%</span>
            </div>
            <div className="flex items-center gap-[-8px]">
              <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-background"></div>
              <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-background -ml-2"></div>
              <div className="w-8 h-8 rounded-full bg-teal-400 border-2 border-background -ml-2"></div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border-2 border-background -ml-2">
                +24
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6 h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-2">Grow your chapter network</h3>
            <p className="text-muted-foreground text-sm">
              Our member growth analytic engine provides detailed insights into chapter participation and referral performance.
            </p>
          </CardContent>
        </Card>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-50">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

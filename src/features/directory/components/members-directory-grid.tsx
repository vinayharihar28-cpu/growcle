"use client";

import { useQuery } from "@tanstack/react-query";
import { getChapterMembers } from "../actions/directory";
import { useAuthStore } from "@/shared/stores/auth";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Building2, Phone, Mail, User } from "lucide-react";
import { useState } from "react";
import { Input } from "@/shared/components/ui/input";

export function MembersDirectoryGrid() {
  const { currentMember } = useAuthStore();
  const chapterId = currentMember?.chapterId;

  const [search, setSearch] = useState("");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["chapter-members", chapterId],
    queryFn: () => getChapterMembers(chapterId as string),
    enabled: !!chapterId,
  });

  if (!chapterId) {
    return <div className="text-muted-foreground p-8">You are not assigned to a chapter yet.</div>;
  }

  const filteredMembers = members.filter((m: any) => {
    const term = search.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(term) ||
      m.lastName.toLowerCase().includes(term) ||
      (m.businessName || "").toLowerCase().includes(term) ||
      (m.industry || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <Input 
          placeholder="Search members by name, business, or industry..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member: any) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-start justify-between">
                  <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {member.industry && (
                    <Badge variant="secondary" className="font-normal truncate max-w-[120px]">
                      {member.industry}
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{member.firstName} {member.lastName}</h3>
                  {member.businessName && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1 gap-1.5">
                      <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{member.businessName}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-sm">
                {member.bio && (
                  <p className="text-muted-foreground line-clamp-3 mb-4 text-xs">
                    "{member.bio}"
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${member.email}`} className="hover:text-primary hover:underline truncate">
                    {member.email}
                  </a>
                </div>
                {member.phoneNumber && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${member.phoneNumber}`} className="hover:text-primary hover:underline">
                      {member.phoneNumber}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {filteredMembers.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed rounded-lg text-muted-foreground">
              No members found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

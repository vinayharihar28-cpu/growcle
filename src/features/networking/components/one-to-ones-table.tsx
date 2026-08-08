"use client";

import { useQuery } from "@tanstack/react-query";
import { getOneToOnes } from "../actions/one-to-ones";
import { useAuthStore } from "@/shared/stores/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { MessagesSquare } from "lucide-react";
import { LogOneToOneDialog } from "./log-one-to-one-dialog";

export function OneToOnesTable() {
  const { currentMember } = useAuthStore();
  const memberId = currentMember?.id;

  const { data: oneToOnes = [], isLoading } = useQuery({
    queryKey: ["one-to-ones", memberId],
    queryFn: () => getOneToOnes(memberId as string),
    enabled: !!memberId,
  });

  if (!memberId) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessagesSquare className="h-5 w-5" />
            My 1-to-1 Meetings
          </CardTitle>
          <CardDescription>Track the 1-to-1 networking meetings you've had with other members.</CardDescription>
        </div>
        <LogOneToOneDialog memberId={memberId} chapterId={currentMember.chapterId as string} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading your 1-to-1s...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Meeting With</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Initiated By</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {oneToOnes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No 1-to-1 meetings logged yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  oneToOnes.map((oto: any) => {
                    const isInitiator = oto.initiatorId === memberId;
                    const partner = isInitiator ? oto.receiver : oto.initiator;

                    return (
                      <TableRow key={oto.id}>
                        <TableCell className="font-medium">
                          {new Date(oto.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{partner.firstName} {partner.lastName}</TableCell>
                        <TableCell>{partner.businessName || "-"}</TableCell>
                        <TableCell>
                          {isInitiator ? (
                            <Badge variant="outline" className="bg-primary/5 text-primary">Me</Badge>
                          ) : (
                            <span className="text-muted-foreground">Them</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {oto.notes || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                            {oto.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logOneToOne } from "../actions/one-to-ones";
import { getChapterMembers } from "@/features/directory/actions/directory";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

const formSchema = z.object({
  receiverId: z.string().min(1, "Please select a member"),
  date: z.string().min(1, "Please select a date"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LogOneToOneDialogProps {
  memberId: string;
  chapterId: string;
}

export function LogOneToOneDialog({ memberId, chapterId }: LogOneToOneDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ["chapter-members", chapterId],
    queryFn: () => getChapterMembers(chapterId),
    enabled: open && !!chapterId,
  });

  // Filter out the current user
  const otherMembers = members.filter((m: any) => m.id !== memberId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverId: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      logOneToOne({
        initiatorId: memberId,
        receiverId: data.receiverId,
        date: new Date(data.date),
        notes: data.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["one-to-ones", memberId] });
      setOpen(false);
      reset();
    },
    onError: (error: any) => {
      alert(`Error logging 1-to-1: ${error.message}`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Log a 1-to-1</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <DialogHeader>
            <DialogTitle>Log 1-to-1 Meeting</DialogTitle>
            <DialogDescription>
              Record a 1-to-1 networking meeting you had with another member of your chapter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="receiverId">Meeting With</Label>
              <select
                id="receiverId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("receiverId")}
              >
                <option value="">Select a member...</option>
                {otherMembers.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} {m.businessName ? `(${m.businessName})` : ""}
                  </option>
                ))}
              </select>
              {errors.receiverId && <p className="text-sm text-destructive">{errors.receiverId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date of Meeting</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Topics Discussed (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="What did you learn about their business? Any specific referral requests?"
                className="h-20"
                {...register("notes")}
              />
              {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging..." : "Log 1-to-1"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

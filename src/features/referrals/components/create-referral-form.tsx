"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReferral } from "../actions/referrals";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";

const formSchema = z.object({
  fromMemberId: z.string().min(1, "Required"),
  toMemberId: z.string().min(1, "Required"),
  chapterId: z.string().min(1, "Required"),
  referralName: z.string().min(2, "Name must be at least 2 characters"),
  referralEmail: z.string().email().optional().or(z.literal("")),
  referralPhone: z.string().optional(),
  notes: z.string().optional(),
  value: z.string().optional(),
});

export function CreateReferralForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromMemberId: "temp-member-id",
      toMemberId: "",
      chapterId: "temp-chapter-id",
      referralName: "",
      referralEmail: "",
      referralPhone: "",
      notes: "",
      value: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => createReferral(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      form.reset();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  const { register, formState: { errors } } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Referral</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toMemberId">To Member (ID)</Label>
            <Input id="toMemberId" placeholder="Enter member ID..." {...register("toMemberId")} />
            {errors.toMemberId && <p className="text-sm text-destructive">{errors.toMemberId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralName">Referral Name</Label>
            <Input id="referralName" placeholder="Jane Doe" {...register("referralName")} />
            {errors.referralName && <p className="text-sm text-destructive">{errors.referralName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referralEmail">Email</Label>
              <Input id="referralEmail" placeholder="jane@example.com" {...register("referralEmail")} />
              {errors.referralEmail && <p className="text-sm text-destructive">{errors.referralEmail.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referralPhone">Phone</Label>
              <Input id="referralPhone" placeholder="+1 555-0100" {...register("referralPhone")} />
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit Referral"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

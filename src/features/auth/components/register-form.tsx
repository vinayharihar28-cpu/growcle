"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getChapters } from "@/features/chapter/actions/chapter";
import { createVisitor } from "@/features/visitors/actions/visitors";

const visitorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  chapterId: z.string().min(1, "Please select a chapter"),
  visitDate: z.string().min(1, "Please select a visit date"),
});

type VisitorFormData = z.infer<typeof visitorSchema>;

interface ChapterOption {
  id: string;
  name: string;
  organization: {
    name: string;
  } | null;
}

export function RegisterForm() {
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      businessName: "",
      industry: "",
      chapterId: "",
      visitDate: "",
    }
  });

  useEffect(() => {
    async function loadChapters() {
      try {
        const list = await getChapters();
        setChapters(list);
      } catch (err) {
        console.error("Failed to load chapters:", err);
      }
    }
    loadChapters();
  }, []);

  const onSubmit = async (data: VisitorFormData) => {
    try {
      setSubmitError("");
      await createVisitor(data);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to register visitor. Please try again.");
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-4 sm:p-8">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-indigo-100 to-white">
          Register as Visitor
        </CardTitle>
        <CardDescription className="text-center text-slate-400">
          Enter your details below to request attendance at one of our chapters
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm">
              Thank you! Your visitor registration request has been submitted successfully. The chapter leadership team will reach out shortly.
            </div>
            <Link 
              href="/" 
              className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md text-sm"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {submitError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
                {submitError}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300 font-medium">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  {...register("firstName")} 
                  className="bg-slate-950/50 border-slate-800/80 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-900 h-11 rounded-xl"
                />
                {errors.firstName && <p className="text-xs text-rose-500 font-medium">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300 font-medium">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  {...register("lastName")} 
                  className="bg-slate-950/50 border-slate-800/80 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-900 h-11 rounded-xl"
                />
                {errors.lastName && <p className="text-xs text-rose-500 font-medium">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                {...register("email")} 
                className="bg-slate-950/50 border-slate-800/80 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-900 h-11 rounded-xl"
              />
              {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-slate-300 font-medium">Business Name (Optional)</Label>
                <Input 
                  id="businessName" 
                  placeholder="Acme Corp" 
                  {...register("businessName")} 
                  className="bg-slate-950/50 border-slate-800/80 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-900 h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-slate-300 font-medium">Industry (Optional)</Label>
                <Input 
                  id="industry" 
                  placeholder="Consulting" 
                  {...register("industry")} 
                  className="bg-slate-950/50 border-slate-800/80 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-900 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapterId" className="text-slate-300 font-medium">Select Chapter</Label>
              <select 
                id="chapterId"
                {...register("chapterId")}
                className="flex w-full rounded-xl border border-slate-800/80 bg-slate-950/50 px-3 py-2 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 h-11 transition-all"
              >
                <option value="" className="bg-slate-950 text-slate-400">Choose a chapter...</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id} className="bg-slate-950 text-slate-100">
                    {ch.name} {ch.organization ? `(${ch.organization.name})` : ""}
                  </option>
                ))}
              </select>
              {errors.chapterId && <p className="text-xs text-rose-500 font-medium">{errors.chapterId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitDate" className="text-slate-300 font-medium">Visit Date</Label>
              <Input 
                id="visitDate" 
                type="date" 
                {...register("visitDate")} 
                className="bg-slate-950/50 border-slate-800/80 text-slate-100 focus-visible:ring-indigo-600 focus-visible:ring-offset-slate-900 h-11 rounded-xl block w-full [color-scheme:dark]"
              />
              {errors.visitDate && <p className="text-xs text-rose-500 font-medium">{errors.visitDate.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 transition-all rounded-xl shadow-lg hover:shadow-indigo-500/25 shadow-indigo-600/10 cursor-pointer mt-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Submit Registration"}
            </Button>

            <div className="text-center text-sm text-slate-400 pt-2">
              Are you a member?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

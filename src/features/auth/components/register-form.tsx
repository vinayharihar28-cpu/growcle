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
import { AlertCircle, CheckCircle2, UserCheck } from "lucide-react";

const visitorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  chapterId: z.string().min(1, "Please select a chapter to visit"),
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
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

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
      triggerShake();
    }
  };

  const onError = () => {
    triggerShake();
  };

  return (
    <Card className={`bg-slate-900/70 border-slate-800/80 backdrop-blur-xl shadow-2xl rounded-3xl p-4 sm:p-8 transition-all ${isShaking ? "animate-shake border-rose-500/50" : ""}`}>
      <CardHeader className="space-y-2 pb-6">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-2">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-indigo-100 to-white">
          Register as Chapter Visitor
        </CardTitle>
        <CardDescription className="text-center text-slate-400">
          Connect with business leaders and attend an upcoming chapter meeting
        </CardDescription>
      </CardHeader>

      <CardContent>
        {success ? (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300 py-4">
            <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Registration Submitted!</h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you! Your visitor registration request has been received. The chapter leadership team will reach out shortly with details.
              </p>
            </div>
            <div className="pt-4">
              <Link 
                href="/" 
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold transition-all shadow-lg text-sm"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
            {submitError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-slate-300 font-medium text-xs">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  {...register("firstName")} 
                  className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-10 rounded-xl ${errors.firstName ? "border-rose-500/70" : ""}`}
                />
                {errors.firstName && <p className="text-[11px] text-rose-400 font-medium">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-slate-300 font-medium text-xs">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  {...register("lastName")} 
                  className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-10 rounded-xl ${errors.lastName ? "border-rose-500/70" : ""}`}
                />
                {errors.lastName && <p className="text-[11px] text-rose-400 font-medium">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 font-medium text-xs">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@company.com" 
                {...register("email")} 
                className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-10 rounded-xl ${errors.email ? "border-rose-500/70" : ""}`}
              />
              {errors.email && <p className="text-[11px] text-rose-400 font-medium">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="businessName" className="text-slate-300 font-medium text-xs">Company Name (Optional)</Label>
                <Input 
                  id="businessName" 
                  placeholder="Acme Corp" 
                  {...register("businessName")} 
                  className="bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="industry" className="text-slate-300 font-medium text-xs">Industry (Optional)</Label>
                <Input 
                  id="industry" 
                  placeholder="Technology / Real Estate" 
                  {...register("industry")} 
                  className="bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="chapterId" className="text-slate-300 font-medium text-xs">Select Chapter</Label>
              <select 
                id="chapterId"
                {...register("chapterId")}
                className={`flex w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 h-10 transition-all ${errors.chapterId ? "border-rose-500/70" : ""}`}
              >
                <option value="" className="bg-slate-950 text-slate-400">Choose a chapter...</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id} className="bg-slate-950 text-slate-100">
                    {ch.name} {ch.organization ? `(${ch.organization.name})` : ""}
                  </option>
                ))}
              </select>
              {errors.chapterId && <p className="text-[11px] text-rose-400 font-medium">{errors.chapterId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="visitDate" className="text-slate-300 font-medium text-xs">Planned Visit Date</Label>
              <Input 
                id="visitDate" 
                type="date" 
                {...register("visitDate")} 
                className={`bg-slate-950/60 border-slate-800 text-slate-100 focus-visible:ring-indigo-500 h-10 rounded-xl block w-full [color-scheme:dark] ${errors.visitDate ? "border-rose-500/70" : ""}`}
              />
              {errors.visitDate && <p className="text-[11px] text-rose-400 font-medium">{errors.visitDate.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold h-11 transition-all rounded-xl shadow-lg hover:shadow-indigo-500/25 cursor-pointer mt-3" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting Registration..." : "Complete Visitor Registration"}
            </Button>

            <div className="text-center text-xs text-slate-400 pt-2">
              Already a registered member?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in to Portal
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

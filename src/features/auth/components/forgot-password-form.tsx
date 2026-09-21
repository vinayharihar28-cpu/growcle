"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authClient.requestPasswordReset({
        email: data.email.trim(),
        redirectTo: "/reset-password",
      });
      setSuccess(true);
    } catch (error) {
      console.error("Forgot password failed", error);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto rounded-3xl bg-card/90 dark:bg-card/75 border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-xl backdrop-blur-xl">
      <CardHeader className="space-y-2 pb-6 px-0">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold text-center text-foreground">
          Forgot password
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground text-xs sm:text-sm">
          Enter your email address and we will send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {success ? (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-xs sm:text-sm leading-relaxed">
              We&apos;ve sent a password reset link to your email address. Please check your inbox.
            </div>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all shadow-md text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to sign in</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground font-medium text-xs sm:text-sm">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  {...register("email")} 
                  className="bg-background/80 border-input text-foreground placeholder:text-muted-foreground pl-10 h-11 rounded-xl focus-visible:ring-primary"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all rounded-xl shadow-md hover:shadow-primary/20 cursor-pointer" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending reset link..." : "Send reset link"}
            </Button>
            <div className="text-center text-xs sm:text-sm text-muted-foreground pt-2">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMsg(null);
      const { data: authData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      });
      
      if (error) {
        setErrorMsg(error.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Email sign in failed", error);
      setErrorMsg("An unexpected network error occurred.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Google sign in failed", error);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
          Welcome back
        </h1>
        <p className="text-slate-400 text-lg">
          Sign in to your account to continue shaping the future.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        
        <div className="space-y-2 group">
          <Label htmlFor="email" className="text-slate-300 font-medium text-sm ml-1 transition-colors group-focus-within:text-indigo-400">
            Email Address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              {...register("email")} 
              className={`bg-slate-900/50 border-slate-800/80 text-white placeholder:text-slate-600 pl-12 h-14 rounded-2xl transition-all duration-300 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 focus:bg-slate-900/80 ${errors.email ? "border-rose-500/70 focus-visible:ring-rose-500/50" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2 group">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" className="text-slate-300 font-medium text-sm transition-colors group-focus-within:text-indigo-400">
              Password
            </Label>
            <Link href="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Lock className="h-5 w-5" />
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              {...register("password")} 
              className={`bg-slate-900/50 border-slate-800/80 text-white placeholder:text-slate-600 pl-12 h-14 rounded-2xl transition-all duration-300 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 focus:bg-slate-900/80 ${errors.password ? "border-rose-500/70 focus-visible:ring-rose-500/50" : ""}`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.password.message}
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="p-4 text-sm font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-white text-black hover:bg-slate-200 font-semibold h-14 text-base transition-all rounded-2xl group flex items-center justify-center gap-2" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          ) : (
            <>
              Sign in
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-4 text-slate-500 tracking-widest font-medium">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-slate-900/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white font-medium h-14 transition-all duration-300 rounded-2xl flex items-center justify-center gap-3"
          onClick={handleGoogleLogin}
        >
          <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Google
        </Button>

        <div className="text-center text-sm text-slate-400 pt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-white hover:text-indigo-300 font-semibold transition-colors">
            Sign up
          </Link>
        </div>

      </form>
    </div>
  );
}

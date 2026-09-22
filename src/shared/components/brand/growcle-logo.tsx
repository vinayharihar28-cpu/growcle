"use client";

import React from "react";

interface GrowcleLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export function GrowcleLogoIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="growcle-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="growcle-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Outer rounded container with soft shadow */}
      <rect width="48" height="48" rx="12" fill="url(#growcle-grad-1)" />
      
      {/* Dynamic continuous growth spiral node representing G and networking chapters */}
      <path
        d="M34 16.5C31.5 13.5 27.5 12 23 12C15.82 12 10 17.82 10 25C10 32.18 15.82 38 23 38C30.18 38 35 33 35 26H23.5"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Synergy spark / growth node dot */}
      <circle cx="35" cy="16.5" r="3.5" fill="url(#growcle-grad-accent)" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

export function GrowcleLogo({
  size = 32,
  showText = true,
  className = "",
  textColor = "text-foreground",
}: GrowcleLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <GrowcleLogoIcon size={size} />
      {showText && (
        <span className={`font-extrabold tracking-tight text-xl ${textColor}`}>
          Growcle
        </span>
      )}
    </div>
  );
}

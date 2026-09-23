"use client";

import { useState, useCallback } from "react";

export interface PickedContact {
  name?: string;
  phone?: string;
  email?: string;
}

/**
 * Standardize and clean phone numbers (e.g. "+91 98765-43210" -> "+919876543210" or "9876543210")
 */
export function cleanPhoneNumber(raw?: string): string {
  if (!raw) return "";
  let cleaned = raw.trim();
  // Preserve leading '+' if present
  const hasPlus = cleaned.startsWith("+");
  cleaned = cleaned.replace(/[^\d]/g, "");
  return hasPlus ? `+${cleaned}` : cleaned;
}

/**
 * Smart parser for pasted contact info (e.g., WhatsApp contact cards, email signatures)
 */
export function parsePastedContactText(text: string): PickedContact {
  if (!text) return {};
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let phone = "";
  let email = "";
  let name = "";

  // 1. Detect phone number: digits with optional +, spaces, hyphens, min 10 digits
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/);
  if (phoneMatch) {
    phone = cleanPhoneNumber(phoneMatch[0]);
  }

  // 2. Detect email address
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    email = emailMatch[0].toLowerCase();
  }

  // 3. Detect name: typically the first line that isn't a phone or email
  for (const line of lines) {
    const isPhone = phoneMatch && line.includes(phoneMatch[0]);
    const isEmail = emailMatch && line.includes(emailMatch[0]);
    if (!isPhone && !isEmail && line.length < 50 && !line.toLowerCase().includes("http")) {
      name = line.replace(/^[•\-\*]\s*/, "").trim();
      break;
    }
  }

  return { name, phone, email };
}

/**
 * Hook to interface with native Web Contact Picker API (Chrome Android, Samsung Internet, Edge Android)
 * with graceful fallback indicator for desktop/iOS Safari.
 */
export function useContactPicker() {
  const [isSupported] = useState<boolean>(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return false;
    return "contacts" in navigator && "ContactsManager" in window;
  });

  const pickContact = useCallback(async (): Promise<PickedContact | null> => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return null;

    if ("contacts" in navigator && "ContactsManager" in window) {
      try {
        const props = ["name", "tel", "email"];
        const opts = { multiple: false };
        const contacts = await (navigator as any).contacts.select(props, opts);

        if (contacts && contacts.length > 0) {
          const c = contacts[0];
          const rawName = Array.isArray(c.name) ? c.name[0] : c.name || "";
          const rawPhone = Array.isArray(c.tel) ? c.tel[0] : c.tel || "";
          const rawEmail = Array.isArray(c.email) ? c.email[0] : c.email || "";

          return {
            name: rawName ? String(rawName).trim() : undefined,
            phone: rawPhone ? cleanPhoneNumber(String(rawPhone)) : undefined,
            email: rawEmail ? String(rawEmail).trim().toLowerCase() : undefined,
          };
        }
      } catch (err: any) {
        // User cancelled picker or denied permission
        if (err.name !== "AbortError") {
          console.warn("[useContactPicker] Native picker error:", err);
        }
      }
    }
    return null;
  }, []);

  return {
    isSupported,
    pickContact,
  };
}

"use client";

import { useState, useCallback, useEffect } from "react";

export interface PickedContact {
  name?: string;
  phone?: string;
  email?: string;
}

export interface PickContactResponse {
  contact?: PickedContact;
  error?: "NOT_SUPPORTED" | "CANCELLED" | "FAILED";
  message?: string;
}

/**
 * Standardize and clean phone numbers (e.g. "+91 98765-43210" -> "+919876543210" or "9876543210")
 */
export function cleanPhoneNumber(raw?: string): string {
  if (!raw) return "";
  let cleaned = raw.trim();
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

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/);
  if (phoneMatch) {
    phone = cleanPhoneNumber(phoneMatch[0]);
  }

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    email = emailMatch[0].toLowerCase();
  }

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
 * Hook to interface directly with native Web Contact Picker API (Chrome Android, Samsung Internet, Edge Android)
 * Directly opens device contacts without modal popups.
 */
export function useContactPicker() {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const supported = "contacts" in navigator && typeof (navigator as any).contacts?.select === "function";
      setIsSupported(Boolean(supported));
    }
  }, []);

  const pickContact = useCallback(async (): Promise<PickContactResponse> => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return { error: "NOT_SUPPORTED", message: "Window or navigator is unavailable." };
    }

    const hasPicker = "contacts" in navigator && typeof (navigator as any).contacts?.select === "function";

    if (!hasPicker) {
      return {
        error: "NOT_SUPPORTED",
        message: "Native contact picker is supported on mobile devices (e.g. Chrome on Android).",
      };
    }

    try {
      let props = ["name", "tel", "email"];
      if (typeof (navigator as any).contacts.getProperties === "function") {
        try {
          const supportedProps: string[] = await (navigator as any).contacts.getProperties();
          props = ["name", "tel", "email"].filter((p) => supportedProps.includes(p));
          if (props.length === 0) props = ["name", "tel"];
        } catch {
          // ignore
        }
      }

      const contacts = await (navigator as any).contacts.select(props, { multiple: false });

      if (contacts && contacts.length > 0) {
        const c = contacts[0];
        const rawName = Array.isArray(c.name) ? c.name[0] : c.name || "";
        const rawPhone = Array.isArray(c.tel) ? c.tel[0] : c.tel || "";
        const rawEmail = Array.isArray(c.email) ? c.email[0] : c.email || "";

        return {
          contact: {
            name: rawName ? String(rawName).trim() : undefined,
            phone: rawPhone ? cleanPhoneNumber(String(rawPhone)) : undefined,
            email: rawEmail ? String(rawEmail).trim().toLowerCase() : undefined,
          },
        };
      }

      return { error: "CANCELLED", message: "User cancelled contact selection." };
    } catch (err: any) {
      if (err.name === "AbortError") {
        return { error: "CANCELLED", message: "User closed picker." };
      }
      console.warn("[useContactPicker] Native picker error:", err);
      return { error: "FAILED", message: err?.message || "Failed to open device contacts." };
    }
  }, []);

  return {
    isSupported,
    pickContact,
  };
}

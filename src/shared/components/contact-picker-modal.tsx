"use client";

import React, { useState } from "react";
import {
  Search,
  UserCheck,
  ClipboardPaste,
  Phone,
  Mail,
  X,
  Smartphone,
  Check,
  Sparkles,
} from "lucide-react";
import { PickedContact, parsePastedContactText } from "@/shared/hooks/use-contact-picker";

interface ContactPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: PickedContact) => void;
  directoryContacts?: {
    id?: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    businessName?: string | null;
    industry?: string | null;
    role?: string | null;
  }[];
  title?: string;
  description?: string;
}

export function ContactPickerModal({
  isOpen,
  onClose,
  onSelectContact,
  directoryContacts = [],
  title = "Select a Contact",
  description = "Pick directly without typing manually",
}: ContactPickerModalProps) {
  const [tab, setTab] = useState<"SEARCH" | "PASTE">("SEARCH");
  const [searchQuery, setSearchQuery] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [parsedPreview, setParsedPreview] = useState<PickedContact | null>(null);

  if (!isOpen) return null;

  const filtered = directoryContacts.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.businessName && c.businessName.toLowerCase().includes(q))
    );
  });

  const handlePasteChange = (text: string) => {
    setPastedText(text);
    if (text.trim()) {
      const parsed = parsePastedContactText(text);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  };

  const handleApplyParsed = () => {
    if (parsedPreview && (parsedPreview.name || parsedPreview.phone || parsedPreview.email)) {
      onSelectContact(parsedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-muted p-1 text-xs font-semibold">
          <button
            onClick={() => setTab("SEARCH")}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === "SEARCH"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            Directory Contacts ({directoryContacts.length})
          </button>
          <button
            onClick={() => setTab("PASTE")}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === "PASTE"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            Smart Paste Card
          </button>
        </div>

        {tab === "SEARCH" ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Search name, phone, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-hidden"
              />
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-border/60 rounded-xl border border-border/70 bg-background/50">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No contacts matching "{searchQuery}".
                </div>
              ) : (
                filtered.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectContact({
                        name: c.name,
                        phone: c.phone || undefined,
                        email: c.email || undefined,
                      });
                      onClose();
                    }}
                    className="p-3 hover:bg-muted/60 transition-colors cursor-pointer flex items-center justify-between gap-3 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{c.name}</p>
                      {c.businessName && (
                        <p className="text-[11px] text-muted-foreground truncate">{c.businessName}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-muted-foreground">
                        {c.phone && (
                          <span className="flex items-center gap-1 text-primary font-mono font-medium">
                            <Phone className="h-3 w-3" /> {c.phone}
                          </span>
                        )}
                        {c.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3" /> {c.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20"
                    >
                      Use
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Paste Contact Card or Message Text
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Ramesh Kumar&#10;+91 98765 43210&#10;ramesh@technologies.in"
                value={pastedText}
                onChange={(e) => handlePasteChange(e.target.value)}
                className="w-full p-2.5 text-xs font-mono bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-hidden"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Paste any shared WhatsApp contact, vCard, or email signature. We will auto-extract the name, phone number, and email.
              </p>
            </div>

            {parsedPreview && (parsedPreview.name || parsedPreview.phone || parsedPreview.email) && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-1.5">
                <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Extracted Contact Preview
                </span>
                <div className="text-xs space-y-1">
                  {parsedPreview.name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-semibold text-foreground">{parsedPreview.name}</span>
                    </div>
                  )}
                  {parsedPreview.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-mono font-bold text-primary">{parsedPreview.phone}</span>
                    </div>
                  )}
                  {parsedPreview.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground">{parsedPreview.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!parsedPreview || (!parsedPreview.name && !parsedPreview.phone)}
              onClick={handleApplyParsed}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" /> Apply Extracted Contact
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-input text-muted-foreground hover:bg-muted cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

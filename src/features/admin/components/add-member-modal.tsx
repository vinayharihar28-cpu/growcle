'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { X, UserPlus, Mail, Phone, Building, Briefcase, ShieldCheck } from 'lucide-react';
import { AdminMember } from '@/types/admin';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AdminMember, 'id' | 'joinedDate' | 'status'>) => Promise<unknown>;
}

export function AddMemberModal({ isOpen, onClose, onSubmit }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    industry: 'Technology & Cloud',
    chapterId: 'chap-01',
    chapterName: 'Silicon Valley Founders',
    roleCode: 'MEMBER',
    roleName: 'Chapter Member',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        businessName: '',
        industry: 'Technology & Cloud',
        chapterId: 'chap-01',
        chapterName: 'Silicon Valley Founders',
        roleCode: 'MEMBER',
        roleName: 'Chapter Member',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-6 overflow-hidden relative">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Add & Invite New Member</h3>
              <p className="text-xs text-muted-foreground">Create member profile and send onboarding invitation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">First Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Last Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jenkins"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="sarah@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-muted-foreground" /> Business / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Jenkins Strategy Co."
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Industry Category
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="Technology & Cloud">Technology & Cloud</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Legal Services">Legal Services</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Marketing & Design">Marketing & Design</option>
                <option value="Business Consulting">Business Consulting</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Chapter Assignment</label>
              <select
                value={formData.chapterId}
                onChange={(e) => {
                  const name = e.target.value === 'chap-01' ? 'Silicon Valley Founders' : 'Metro Executive Network';
                  setFormData({ ...formData, chapterId: e.target.value, chapterName: name });
                }}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="chap-01">Silicon Valley Founders</option>
                <option value="chap-02">Metro Executive Network</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Assigned Role
              </label>
              <select
                value={formData.roleCode}
                onChange={(e) => {
                  const code = e.target.value;
                  const nameMap: Record<string, string> = {
                    MEMBER: 'Chapter Member',
                    CHAPTER_PRESIDENT: 'Chapter President',
                    VICE_PRESIDENT: 'Vice President',
                    SECRETARY_TREASURER: 'Secretary / Treasurer',
                    ORG_ADMIN: 'Organization Admin',
                  };
                  setFormData({ ...formData, roleCode: code, roleName: nameMap[code] || code });
                }}
                className="w-full px-3 py-2 rounded-lg border bg-background text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="MEMBER">Chapter Member</option>
                <option value="CHAPTER_PRESIDENT">Chapter President</option>
                <option value="VICE_PRESIDENT">Vice President</option>
                <option value="SECRETARY_TREASURER">Secretary / Treasurer</option>
                <option value="ORG_ADMIN">Organization Admin</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {submitting ? 'Creating Member...' : 'Create & Invite Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

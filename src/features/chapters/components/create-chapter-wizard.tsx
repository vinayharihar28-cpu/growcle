'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { X, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface CreateChapterWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export function CreateChapterWizard({ isOpen, onClose, onComplete }: CreateChapterWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', code: '', description: '', region: '', location: '',
    meetingDay: 'Thursday', meetingTime: '07:30 AM', meetingLocation: '', meetingType: 'IN_PERSON',
    directorId: '', presidentId: '', vicePresidentId: '', treasurerId: ''
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(6, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    onComplete(formData);
    onClose();
    setTimeout(() => setStep(1), 300); // reset after close
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6">
      <div className="bg-background rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div>
            <h2 className="text-xl font-bold">Create New Chapter</h2>
            <p className="text-xs text-muted-foreground mt-1">Step {step} of 6</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h3 className="font-bold text-sm mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Chapter Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="e.g. Silicon Valley Founders" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Chapter Code *</label>
                  <input type="text" value={formData.code} onChange={(e) => handleChange('code', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="e.g. SV-001" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Description</label>
                  <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full p-2 text-sm border rounded-lg" rows={3} placeholder="Brief description of the chapter focus..."></textarea>
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Region *</label>
                  <input type="text" value={formData.region} onChange={(e) => handleChange('region', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="e.g. West Coast" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Location (City, State) *</label>
                  <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="e.g. Palo Alto, CA" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h3 className="font-bold text-sm mb-4">Meeting Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Meeting Day</label>
                  <select value={formData.meetingDay} onChange={(e) => handleChange('meetingDay', e.target.value)} className="w-full p-2 text-sm border rounded-lg bg-background">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Meeting Time</label>
                  <input type="text" value={formData.meetingTime} onChange={(e) => handleChange('meetingTime', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="e.g. 07:30 AM" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Meeting Type</label>
                  <select value={formData.meetingType} onChange={(e) => handleChange('meetingType', e.target.value)} className="w-full p-2 text-sm border rounded-lg bg-background">
                    <option value="IN_PERSON">In Person</option>
                    <option value="ONLINE">Online (Virtual)</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Primary Meeting Location / Link</label>
                  <input type="text" value={formData.meetingLocation} onChange={(e) => handleChange('meetingLocation', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="Physical address or Zoom link" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h3 className="font-bold text-sm mb-4">Director Assignment</h3>
              <p className="text-xs text-muted-foreground mb-4">Select an existing Director to oversee this chapter.</p>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Select Director</label>
                <select value={formData.directorId} onChange={(e) => handleChange('directorId', e.target.value)} className="w-full p-2 text-sm border rounded-lg bg-background">
                  <option value="">-- Unassigned --</option>
                  <option value="mem-101">Alexandra Chen (Area Director)</option>
                  <option value="mem-102">Robert Smith (Executive Director)</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h3 className="font-bold text-sm mb-4">Leadership Team Assignment</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">President</label>
                  <input type="text" value={formData.presidentId} onChange={(e) => handleChange('presidentId', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="Search by name or email (leave empty to assign later)" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Vice President</label>
                  <input type="text" value={formData.vicePresidentId} onChange={(e) => handleChange('vicePresidentId', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="Search by name or email" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Secretary / Treasurer</label>
                  <input type="text" value={formData.treasurerId} onChange={(e) => handleChange('treasurerId', e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="Search by name or email" />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h3 className="font-bold text-sm mb-4">Review Information</h3>
              <div className="rounded-xl border bg-muted/20 p-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground text-xs">Chapter Name</div><div className="font-semibold">{formData.name || 'Not provided'}</div>
                  <div className="text-muted-foreground text-xs">Code</div><div className="font-semibold">{formData.code || 'Not provided'}</div>
                  <div className="text-muted-foreground text-xs">Region</div><div className="font-semibold">{formData.region || 'Not provided'}</div>
                  <div className="text-muted-foreground text-xs">Location</div><div className="font-semibold">{formData.location || 'Not provided'}</div>
                  <div className="text-muted-foreground text-xs">Meeting Schedule</div><div className="font-semibold">{formData.meetingDay}, {formData.meetingTime} ({formData.meetingType.replace('_', ' ')})</div>
                  <div className="text-muted-foreground text-xs">Director</div><div className="font-semibold">{formData.directorId ? 'Assigned' : 'Unassigned'}</div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="h-full flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-foreground">Ready to Create</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  The chapter "{formData.name || 'New Chapter'}" will be created and leadership assignments will be finalized.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t bg-muted/20 flex justify-between shrink-0">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1 || step === 6} className="text-xs font-semibold">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          
          {step < 5 && (
            <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
              Next Step <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {step === 5 && (
            <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
              Review Complete <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {step === 6 && (
            <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Create Chapter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { BrandingSettingsForm } from "@/features/super-admin/components/branding-settings-form";

export default function BrandingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Branding Defaults</h2>
        <p className="text-muted-foreground">Manage the white-label branding configurations for specific tenant organizations.</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <BrandingSettingsForm />
      </div>
    </div>
  );
}

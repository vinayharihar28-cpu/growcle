"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrganizations, updateOrganizationBranding } from "../actions/organizations";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";

const brandingSchema = z.object({
  organizationId: z.string().min(1, "Organization is required"),
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color code (e.g. #4F46E5)").optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  customDomain: z.string().optional().or(z.literal("")),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

export function BrandingSettingsForm() {
  const { data: organizations = [], isLoading: isLoadingOrgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      organizationId: "",
      primaryColor: "#4F46E5",
      logoUrl: "",
      customDomain: "",
    },
  });

  const selectedOrgId = watch("organizationId");
  const selectedOrg = organizations.find((o: any) => o.id === selectedOrgId);
  const primaryColor = watch("primaryColor") || "#4F46E5";

  // When org changes, populate form with its current branding
  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = e.target.value;
    setValue("organizationId", orgId);
    
    const org = organizations.find((o: any) => o.id === orgId);
    if (org) {
      setValue("primaryColor", org.primaryColor || "#4F46E5");
      setValue("logoUrl", org.logoUrl || "");
      setValue("customDomain", org.customDomain || "");
    }
  };

  const { mutate: updateBranding, isPending } = useMutation({
    mutationFn: (data: BrandingFormValues) =>
      updateOrganizationBranding(data.organizationId, {
        primaryColor: data.primaryColor || undefined,
        logoUrl: data.logoUrl || undefined,
        customDomain: data.customDomain || undefined,
      }),
    onSuccess: () => {
      alert("Branding settings updated successfully!");
    },
    onError: (error: any) => {
      alert(`Error updating branding: ${error.message}`);
    },
  });

  const onSubmit = (data: BrandingFormValues) => {
    updateBranding(data);
  };

  if (isLoadingOrgs) return <div className="text-sm text-muted-foreground">Loading organizations...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>White-Label Branding</CardTitle>
              <CardDescription>
                Customize the appearance of the SaaS for a specific tenant organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="organizationId">Target Organization</Label>
                <select
                  id="organizationId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("organizationId")}
                  onChange={handleOrgChange}
                >
                  <option value="">Select an organization...</option>
                  {organizations.map((org: any) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {errors.organizationId && <p className="text-sm text-destructive">{errors.organizationId.message}</p>}
              </div>

              {selectedOrgId && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Brand Primary Color (Hex)</Label>
                    <div className="flex gap-4">
                      <Input
                        id="colorPicker"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setValue("primaryColor", e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        id="primaryColor"
                        placeholder="#4F46E5"
                        {...register("primaryColor")}
                        className="flex-1"
                      />
                    </div>
                    {errors.primaryColor && <p className="text-sm text-destructive">{errors.primaryColor.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Custom Logo URL</Label>
                    <Input
                      id="logoUrl"
                      placeholder="https://example.com/logo.png"
                      {...register("logoUrl")}
                    />
                    {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl.message}</p>}
                    <p className="text-xs text-muted-foreground">Provide a transparent PNG or SVG logo for the sidebar.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customDomain">Custom Domain</Label>
                    <Input
                      id="customDomain"
                      placeholder="portal.theircompany.com"
                      {...register("customDomain")}
                    />
                    {errors.customDomain && <p className="text-sm text-destructive">{errors.customDomain.message}</p>}
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50 border-t px-6 py-4">
              <Button type="submit" disabled={!selectedOrgId || isPending} className="ml-auto">
                {isPending ? "Saving..." : "Save Branding Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>How it will look for their users</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedOrgId ? (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="h-12 border-b flex items-center px-4 gap-3 bg-sidebar">
                  {watch("logoUrl") ? (
                    <img src={watch("logoUrl")} alt="Logo" className="h-6 object-contain" />
                  ) : (
                    <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold" style={{ backgroundColor: primaryColor }}>
                      {selectedOrg?.name?.charAt(0) || "G"}
                    </div>
                  )}
                  <span className="font-bold text-sm" style={{ color: primaryColor }}>
                    {selectedOrg?.name || "Acme Corp"}
                  </span>
                </div>
                <div className="p-4 space-y-4 bg-background">
                  <div className="h-4 w-1/3 rounded" style={{ backgroundColor: primaryColor, opacity: 0.2 }} />
                  <div className="h-24 rounded border border-dashed flex items-center justify-center">
                    <Button size="sm" style={{ backgroundColor: primaryColor, color: "#fff" }}>Primary Action</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-10 border border-dashed rounded-lg">
                Select an organization to preview branding
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

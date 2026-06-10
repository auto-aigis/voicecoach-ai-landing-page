"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AppShell } from "@/app/_components/AppShell";
import { useAuth } from "@/app/_components/AuthProvider";
import { settingsApi } from "@/app/_lib/api";
import type { UserSettings } from "@/app/_lib/types";
import { Loader2, Save, CreditCard, Bell } from "lucide-react";

function SettingsContent() {
  const { user, loading: authLoading, refresh } = useAuth();
  const searchParams = useSearchParams();

  const [displayName, setDisplayName] = useState("");
  const [coachingReceiptOptOut, setCoachingReceiptOptOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsApi.get();
        setDisplayName(data.display_name || "");
        setCoachingReceiptOptOut(data.coaching_receipt_opt_out || false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      fetchSettings();
    }
  }, [authLoading]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await settingsApi.update(displayName || null, coachingReceiptOptOut);
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
          <p className="text-gray-500">Manage your profile and preferences</p>
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your public display information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : saved ? (
                <Save className="mr-2 h-4 w-4" />
              ) : null}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your email preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Weekly Coaching Receipt</p>
                <p className="text-sm text-gray-500">
                  Receive a summary of your practice progress every Monday
                </p>
              </div>
              <Switch
                checked={!coachingReceiptOptOut}
                onCheckedChange={(checked) => setCoachingReceiptOptOut(!checked)}
              />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : saved ? (
                <Save className="mr-2 h-4 w-4" />
              ) : null}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>Manage your plan and payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Current Plan: {user?.tier?.toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  {user?.tier === "free" 
                    ? "You're on the free tier" 
                    : "Manage your subscription"}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/pricing">
                  {user?.tier === "free" ? "Upgrade" : "Change Plan"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
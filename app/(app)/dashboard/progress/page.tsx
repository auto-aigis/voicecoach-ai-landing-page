"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/app/_components/AppShell";
import { useAuth } from "@/app/_components/AuthProvider";
import { progressApi } from "@/app/_lib/api";
import type { ProgressData } from "@/app/_lib/types";
import { Loader2, Lock, TrendingUp } from "lucide-react";

function ProgressContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const [data, setData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  const isPlus = user?.tier === "plus";

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isPlus) {
        setLoading(false);
        return;
      }
      try {
        const result = await progressApi.get();
        setData(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      fetchProgress();
    }
  }, [isPlus, authLoading]);

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AppShell>
    );
  }

  if (!isPlus) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Progress Dashboard</h1>
            <p className="text-gray-500">Track your improvement over time</p>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-gray-100 p-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-100/80" />
              <div className="relative z-10 text-center">
                <Lock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h2 className="mb-2 text-xl font-semibold text-gray-700">Plus Tier Required</h2>
                <p className="mb-4 text-gray-500">
                  Upgrade to Plus to access 12-week trend charts and advanced progress tracking.
                </p>
                <Button asChild>
                  <Link href="/pricing">Upgrade to Plus</Link>
                </Button>
              </div>
            </div>
            <div className="blur-sm">
              <div className="h-48 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const renderChart = (title: string, key: "pitch_accuracy" | "breath_control" | "resonance") => {
    const values = data.map((d) => d[key]);
    const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    const trend = values.length >= 2 ? values[values.length - 1] - values[0] : 0;

    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>
            {data.length < 2
              ? "Complete more sessions to see trends"
              : `${trend > 0 ? "+" : ""}${trend}% over ${data.length} weeks`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length < 2 ? (
            <div className="flex h-32 items-center justify-center text-gray-400">
              Need at least 2 sessions to display chart
            </div>
          ) : (
            <div className="flex h-32 items-end justify-between gap-1">
              {data.map((d, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded bg-gray-900 transition-all"
                    style={{ height: `${d[key]}%` }}
                  />
                  <span className="text-xs text-gray-400">
                    {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">Average</span>
            <span className="font-semibold text-gray-900">{avg}%</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Progress Dashboard</h1>
          <p className="text-gray-500">12-week trend analysis</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {renderChart("Pitch Accuracy", "pitch_accuracy")}
          {renderChart("Breath Control", "breath_control")}
          {renderChart("Resonance", "resonance")}
        </div>
      </div>
    </AppShell>
  );
}

export default function ProgressPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ProgressContent />
    </Suspense>
  );
}
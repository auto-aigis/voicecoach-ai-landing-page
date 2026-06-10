"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PracticePlan } from "@/app/_lib/types";
import { practicePlanApi } from "@/app/_lib/api";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";

interface PracticePlanCardProps {
  plan: PracticePlan | null;
  canAccess: boolean;
}

export function PracticePlanCard({ plan, canAccess }: PracticePlanCardProps) {
  const router = useRouter();
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await practicePlanApi.regenerate();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setRegenerating(false);
    }
  };

  if (!canAccess) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Practice Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-gray-500">Unlock personalized practice plans with Pro</p>
            <Button asChild>
              <a href="/pricing">Upgrade to Pro</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Practice Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Complete your first session to generate your practice plan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Weekly Practice Plan</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={regenerating}>
          {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {plan.exercises.slice(0, 3).map((exercise, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
              <Badge variant="outline" className="mt-0.5">
                {idx + 1}
              </Badge>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{exercise.title}</p>
                <p className="text-sm text-gray-500">{exercise.description}</p>
                <p className="mt-1 text-xs text-gray-400">{exercise.duration_minutes} min</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
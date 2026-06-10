"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/app/_components/AppShell";
import { useAuth } from "@/app/_components/AuthProvider";
import { sessionsApi } from "@/app/_lib/api";
import type { SessionDetail } from "@/app/_lib/types";
import { ArrowLeft, Loader2, Lock, CheckCircle, Music, Wind, Sparkles } from "lucide-react";

function SessionDetailContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const canAccessFull = user?.tier === "pro" || user?.tier === "plus";

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      try {
        const data = await sessionsApi.get(sessionId);
        setSession(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && sessionId) {
      fetchSession();
    }
  }, [sessionId, authLoading]);

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell>
        <div className="text-center">
          <p className="text-gray-500">Session not found</p>
          <Button variant="link" asChild className="mt-2">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Button variant="ghost" asChild className="-ml-2">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Coaching Report</h1>
          <p className="text-gray-500">{formatDate(session.created_at)}</p>
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Pitch Accuracy
            </CardTitle>
            <CardDescription>Percentage of notes within ±50 cents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <p className="text-5xl font-bold text-gray-900">
                {session.pitch_accuracy_score ?? "--"}%
              </p>
              <p className="mb-2 text-sm text-gray-500">
                {formatDuration(session.duration_seconds)} recorded
              </p>
            </div>
          </CardContent>
        </Card>

        {canAccessFull ? (
          <>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5" />
                  Breath Control
                </CardTitle>
                <CardDescription>Sustained note duration and breath break patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-gray-900">
                  {session.breath_control_score ?? "--"}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Tone & Resonance
                </CardTitle>
                <CardDescription>Clarity and resonance quality</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-gray-900">
                  {session.resonance_score ?? "--"}%
                </p>
              </CardContent>
            </Card>

            {session.corrective_prompts && session.corrective_prompts.length > 0 && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Coach&apos;s Tips</CardTitle>
                  <CardDescription>Actionable feedback to improve your singing</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {session.corrective_prompts.map((prompt, idx) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-gray-700">{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Lock className="h-4 w-4" />
                Unlock Full Feedback
              </CardTitle>
              <CardDescription className="text-amber-700">
                Upgrade to Pro to see breath control, resonance scores, and personalized coaching tips.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/pricing">Upgrade to Pro</a>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard/record">Start Another Session</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

export default function SessionDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <SessionDetailContent />
    </Suspense>
  );
}
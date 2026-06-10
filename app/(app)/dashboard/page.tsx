"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/_components/AuthProvider";
import { AppShell } from "@/app/_components/AppShell";
import { PracticePlanCard } from "@/app/_components/PracticePlanCard";
import { sessionsApi, practicePlanApi, onboardingApi, paymentsApi } from "@/app/_lib/api";
import type { Session, PracticePlan, OnboardingStatus } from "@/app/_lib/types";
import { Flame, Mic, Loader2 } from "lucide-react";

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const transactionId = searchParams.get("transaction_id");

  const [sessions, setSessions] = useState<Session[]>([]);
  const [plan, setPlan] = useState<PracticePlan | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  const canAccessFull = user?.tier === "pro" || user?.tier === "plus";

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const status = await onboardingApi.getStatus();
        if (!status.onboarding_complete) {
          router.push("/onboarding");
        }
      } catch {
        router.push("/login");
      }
    };
    if (!authLoading && user) {
      checkOnboarding();
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (checkoutSuccess && transactionId) {
        setProcessingPayment(true);
        try {
          await paymentsApi.verifyTransaction(transactionId);
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        } catch (err) {
          console.error("Payment verification failed:", err);
        } finally {
          setProcessingPayment(false);
        }
      }
    };
    verifyPayment();
  }, [checkoutSuccess, transactionId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || authLoading) return;
      try {
        const [sessionsData, planData] = await Promise.all([
          sessionsApi.list(5, 0),
          canAccessFull ? practicePlanApi.get() : Promise.resolve(null),
        ]);
        setSessions(sessionsData.sessions);
        setPlan(planData);
        const dates = [...new Set(sessionsData.sessions.map((s) => s.created_at.split("T")[0]))];
        setStreak(dates.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading, canAccessFull]);

  if (authLoading || loading || processingPayment) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            {processingPayment ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="text-gray-500">Processing payment...</p>
              </>
            ) : (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="text-gray-500">Loading...</p>
              </>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back{user?.display_name ? `, ${user.display_name}` : ""}
          </h1>
          <p className="text-gray-500">Ready to practice today?</p>
        </div>

        {processingPayment && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-3 pt-6">
              <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
              <p className="text-amber-700">
                Payment processing... your subscription will be activated shortly.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Flame className="h-4 w-4" />
                Practice Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canAccessFull ? (
                <p className="text-3xl font-bold text-gray-900">{streak}</p>
              ) : (
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-300">--</p>
                  <p className="mt-1 text-xs text-gray-400">
                    <Link href="/pricing" className="underline">Upgrade to track</Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {sessions.length}
                <span className="text-base font-normal text-gray-500"> sessions</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Your Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {canAccessFull && plan ? (
                <p className="text-lg font-semibold text-gray-900">
                  {plan.exercises.length} exercises
                </p>
              ) : canAccessFull ? (
                <p className="text-gray-500">Start your first session!</p>
              ) : (
                <div className="text-center">
                  <p className="text-gray-300">Locked</p>
                  <p className="mt-1 text-xs text-gray-400">
                    <Link href="/pricing" className="underline">Upgrade to unlock</Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center py-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard/record">
              <Mic className="h-5 w-5" />
              Start Practice Session
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PracticePlanCard plan={plan} canAccess={canAccessFull} />

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/history">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-gray-500">No sessions yet. Start practicing!</p>
              ) : (
                <div className="space-y-2">
                  {sessions.slice(0, 3).map((session) => (
                    <Link
                      key={session.id}
                      href={`/dashboard/session/${session.id}`}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                    >
                      <span className="text-gray-900">
                        {new Date(session.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="font-medium text-gray-900">
                        {session.pitch_accuracy_score ?? "--"}% pitch
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {!canAccessFull && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-amber-900">Upgrade to Pro</p>
                <p className="text-sm text-amber-700">
                  Unlock full feedback, practice plans, and more
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/pricing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
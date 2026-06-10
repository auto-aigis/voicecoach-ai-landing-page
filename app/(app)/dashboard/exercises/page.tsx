"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/app/_components/AppShell";
import { useAuth } from "@/app/_components/AuthProvider";
import { exercisesApi } from "@/app/_lib/api";
import type { ExerciseLibrary } from "@/app/_lib/types";
import { Loader2, Lock, BookOpen, Music, Wind, Sparkles } from "lucide-react";

const libraryIcons: Record<string, React.ReactNode> = {
  "Pitch Accuracy Bootcamp": <Music className="h-5 w-5" />,
  "Breath Control Mastery": <Wind className="h-5 w-5" />,
  "Vibrato Foundation": <Sparkles className="h-5 w-5" />,
};

function ExercisesContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const [libraries, setLibraries] = useState<ExerciseLibrary[]>([]);
  const [loading, setLoading] = useState(true);

  const canAccessFull = user?.tier === "pro" || user?.tier === "plus";
  const isPlus = user?.tier === "plus";

  useEffect(() => {
    const fetchExercises = async () => {
      if (!canAccessFull) {
        setLoading(false);
        return;
      }
      try {
        const data = await exercisesApi.list();
        setLibraries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      fetchExercises();
    }
  }, [canAccessFull, authLoading]);

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AppShell>
    );
  }

  if (!canAccessFull) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Exercise Libraries</h1>
            <p className="text-gray-500">Goal-specific exercises to improve your singing</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {["Pitch Accuracy Bootcamp", "Breath Control Mastery", "Vibrato Foundation"].map((name) => (
              <div key={name} className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 p-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-100/80" />
                  <div className="relative z-10 text-center">
                    <Lock className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Pro Tier</p>
                  </div>
                </div>
                <div className="blur-sm">
                  <h3 className="mb-2 text-lg font-semibold text-gray-700">{name}</h3>
                  <p className="text-sm text-gray-500">Exercise descriptions...</p>
                </div>
              </div>
            ))}
          </div>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-amber-900">Upgrade to Pro</p>
                <p className="text-sm text-amber-700">
                  Unlock exercise libraries tailored to your goals
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/pricing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Exercise Libraries</h1>
          <p className="text-gray-500">
            {isPlus ? "All 3 libraries" : "2 of 3 libraries"} available with your tier
          </p>
        </div>

        <div className="grid gap-6">
          {libraries.map((library) => (
            <Card key={library.library_name} className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {libraryIcons[library.library_name] || <BookOpen className="h-5 w-5" />}
                  {library.library_name}
                </CardTitle>
                <CardDescription>
                  {library.exercises.length} exercises
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {library.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="rounded-lg border border-gray-100 p-4"
                    >
                      <h4 className="font-medium text-gray-900">{exercise.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{exercise.description}</p>
                      <p className="mt-2 text-xs text-gray-400">{exercise.instructions}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default function ExercisesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ExercisesContent />
    </Suspense>
  );
}
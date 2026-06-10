"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { onboardingApi } from "@/app/_lib/api";
import type { SkillLevel, Goal, Genre } from "@/app/_lib/types";
import { ChevronRight, Music, Target, Heart } from "lucide-react";

const skillLevels: { value: SkillLevel; label: string; description: string }[] = [
  { value: "beginner", label: "Beginner", description: "Just starting out" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "advanced", label: "Advanced", description: "Experienced singer" },
];

const goals: { value: Goal; label: string; icon: React.ReactNode }[] = [
  { value: "pitch accuracy", label: "Pitch Accuracy", icon: <Music className="h-5 w-5" /> },
  { value: "breath control", label: "Breath Control", icon: <Target className="h-5 w-5" /> },
  { value: "general improvement", label: "General Improvement", icon: <Heart className="h-5 w-5" /> },
];

const genres: { value: Genre; label: string }[] = [
  { value: "pop", label: "Pop" },
  { value: "classical", label: "Classical" },
  { value: "jazz", label: "Jazz" },
  { value: "other", label: "Other" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!skillLevel || !goal || !genre) return;
    setLoading(true);
    setError("");

    try {
      await onboardingApi.submit(skillLevel, goal, genre);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return skillLevel !== null;
    if (step === 1) return goal !== null;
    if (step === 2) return genre !== null;
    return false;
  };

  const steps = [
    {
      title: "What's your skill level?",
      description: "This helps us customize your practice plan",
      content: (
        <div className="grid gap-3">
          {skillLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSkillLevel(level.value)}
              className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                skillLevel === level.value
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">{level.label}</p>
                <p className="text-sm text-gray-500">{level.description}</p>
              </div>
              {skillLevel === level.value && (
                <div className="h-5 w-5 rounded-full bg-gray-900" />
              )}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your primary goal?",
      description: "Focus on what matters most to you",
      content: (
        <div className="grid gap-3">
          {goals.map((g) => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                goal === g.value
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                {g.icon}
              </div>
              <p className="font-medium text-gray-900">{g.label}</p>
              {goal === g.value && (
                <div className="ml-auto h-5 w-5 rounded-full bg-gray-900" />
              )}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your favorite genre?",
      description: "We'll tailor feedback to your style",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {genres.map((g) => (
            <button
              key={g.value}
              onClick={() => setGenre(g.value)}
              className={`rounded-lg border p-4 text-center transition-colors ${
                genre === g.value
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <p className="font-medium text-gray-900">{g.label}</p>
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-8 rounded-full transition-colors ${
                  idx <= step ? "bg-gray-900" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-xl">{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {steps[step].content}
          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={!canProceed() || loading}
              className="flex-1"
            >
              {loading
                ? "Saving..."
                : step < steps.length - 1
                ? "Continue"
                : "Get Started"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
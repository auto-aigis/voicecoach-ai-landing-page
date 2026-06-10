"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Session } from "@/app/_lib/types";

interface SessionHistoryListProps {
  sessions: Session[];
  canAccessFull: boolean;
}

export function SessionHistoryList({ sessions, canAccessFull }: SessionHistoryListProps) {
  if (!sessions.length) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No sessions yet. Start your first practice!</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Session History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/dashboard/session/${session.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{formatDate(session.created_at)}</span>
                <span className="text-sm text-gray-500">{formatDuration(session.duration_seconds)}</span>
              </div>
              <div className="flex items-center gap-4">
                {session.pitch_accuracy_score != null && (
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Pitch</span>
                    <p className="font-semibold text-gray-900">{session.pitch_accuracy_score}%</p>
                  </div>
                )}
                {canAccessFull && session.breath_control_score != null && (
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Breath</span>
                    <p className="font-semibold text-gray-900">{session.breath_control_score}%</p>
                  </div>
                )}
                {canAccessFull && session.resonance_score != null && (
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Resonance</span>
                    <p className="font-semibold text-gray-900">{session.resonance_score}%</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        {!canAccessFull && sessions.length > 0 && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-center">
            <p className="text-sm text-amber-700">
              Showing last 7 days.{" "}
              <Button variant="link" className="h-auto p-0 text-amber-700" asChild>
                <a href="/pricing">Upgrade to Pro for 90-day history</a>
              </Button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
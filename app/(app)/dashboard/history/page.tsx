"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/app/_components/AppShell";
import { SessionHistoryList } from "@/app/_components/SessionHistoryList";
import { useAuth } from "@/app/_components/AuthProvider";
import { sessionsApi } from "@/app/_lib/api";
import type { Session } from "@/app/_lib/types";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

function HistoryContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const offsetParam = parseInt(searchParams.get("offset") || "0", 10);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const canAccessFull = user?.tier === "pro" || user?.tier === "plus";
  const limit = 20;
  const offset = offsetParam;
  const hasMore = offset + limit < totalCount;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await sessionsApi.list(limit, offset);
        setSessions(data.sessions);
        setTotalCount(data.total_count);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      fetchSessions();
    }
  }, [offset, authLoading]);

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
          <h1 className="text-2xl font-semibold text-gray-900">Session History</h1>
          <p className="text-gray-500">
            {canAccessFull ? "Last 90 days" : "Last 7 days"} of practice
          </p>
        </div>

        <SessionHistoryList sessions={sessions} canAccessFull={canAccessFull} />

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={offset === 0}
            onClick={() => {
              const newOffset = Math.max(0, offset - limit);
              const url = new URL(window.location.href);
              url.searchParams.set("offset", newOffset.toString());
              window.location.href = url.toString();
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            {offset + 1}-{Math.min(offset + limit, totalCount)} of {totalCount}
          </span>
          <Button
            variant="outline"
            disabled={!hasMore}
            onClick={() => {
              const newOffset = offset + limit;
              const url = new URL(window.location.href);
              url.searchParams.set("offset", newOffset.toString());
              window.location.href = url.toString();
            }}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
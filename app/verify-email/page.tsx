"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const { refresh } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "sent">(
    token ? "loading" : emailParam ? "sent" : "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          await authApi.verifyEmail(token);
          setStatus("success");
          await refresh();
          setTimeout(() => router.push("/onboarding"), 1500);
        } catch (err) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Verification failed");
        }
      };
      verify();
    }
  }, [token, refresh, router]);

  const handleResend = async () => {
    if (!emailParam) return;
    try {
      await authApi.resendVerification(emailParam);
      alert("Verification email sent!");
    } catch {
      alert("Failed to resend. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-gray-500">Verifying your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-sm border-gray-200">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
            <CardTitle>Email verified!</CardTitle>
            <CardDescription>Redirecting you to onboarding...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-sm border-gray-200">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto mb-2 h-12 w-12 text-red-500" />
            <CardTitle>Verification failed</CardTitle>
            <CardDescription>{errorMsg}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/login">
              <Button>Back to login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm border-gray-200">
        <CardHeader className="text-center">
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to<br />
            <span className="font-medium text-gray-900">{emailParam}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleResend}>
            Resend verification email
          </Button>
          <div className="text-center text-sm text-gray-500">
            <Link href="/login" className="font-medium text-gray-900 hover:underline">
              Sign in
            </Link>{" "}if you already verified
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
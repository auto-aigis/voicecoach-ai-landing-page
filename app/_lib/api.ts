import type { User, Subscription, SessionsResponse, SessionDetail, WeekCount, PracticePlan, ProgressData, ExerciseLibrary, UserSettings, OnboardingStatus, CheckoutResponse, SkillLevel, Goal, Genre, Tier, BillingInterval } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: Record<string, unknown>) => e.msg).join(", ");
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name: displayName || null }),
    }),

  login: (email: string, password: string) =>
    apiFetch<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<User>("/api/auth/me"),

  subscription: () => apiFetch<Subscription>("/api/auth/subscription"),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const onboardingApi = {
  getStatus: () => apiFetch<OnboardingStatus>("/api/onboarding"),

  submit: (skillLevel: SkillLevel, goal: Goal, genre: Genre) =>
    apiFetch<OnboardingStatus>("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({ skill_level: skillLevel, goal, genre }),
    }),
};

export const sessionsApi = {
  list: (limit = 20, offset = 0) =>
    apiFetch<SessionsResponse>(`/api/sessions?limit=${limit}&offset=${offset}`),

  create: (durationSeconds: number, audioData: string) =>
    apiFetch<SessionDetail>("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ duration_seconds: durationSeconds, audio_data: audioData }),
    }),

  get: (sessionId: string) => apiFetch<SessionDetail>(`/api/sessions/${sessionId}`),

  weekCount: () => apiFetch<WeekCount>("/api/sessions/week-count"),
};

export const practicePlanApi = {
  get: () => apiFetch<PracticePlan>("/api/practice-plan"),

  regenerate: () => apiFetch<PracticePlan>("/api/practice-plan/regenerate", { method: "POST" }),
};

export const progressApi = {
  get: () => apiFetch<{ data: ProgressData[] }>("/api/progress"),
};

export const exercisesApi = {
  list: () => apiFetch<ExerciseLibrary[]>("/api/exercises"),
};

export const settingsApi = {
  get: () => apiFetch<UserSettings>("/api/settings"),

  update: (displayName: string | null, coachingReceiptOptOut: boolean | null) =>
    apiFetch<UserSettings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ display_name: displayName, coaching_receipt_opt_out: coachingReceiptOptOut }),
    }),
};

export const paymentsApi = {
  checkout: (tier: Tier, billingInterval: BillingInterval) =>
    apiFetch<CheckoutResponse>("/api/paddle/checkout", {
      method: "POST",
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),

  verifyTransaction: (transactionId: string) =>
    apiFetch<{ status: string }>("/api/paddle/verify-transaction", {
      method: "POST",
      body: JSON.stringify({ transaction_id: transactionId }),
    }),
};
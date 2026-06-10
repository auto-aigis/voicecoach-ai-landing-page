export interface User {
  id: string;
  email: string;
  display_name: string | null;
  skill_level: string | null;
  goal: string | null;
  genre: string | null;
  onboarding_complete: boolean;
  tier: "free" | "pro" | "plus";
  created_at: string;
}

export interface Subscription {
  tier: "free" | "pro" | "plus";
  status: "active" | "inactive" | "canceled";
  current_period_end: string | null;
}

export interface Session {
  id: string;
  user_id: string;
  audio_url: string | null;
  duration_seconds: number;
  pitch_accuracy_score: number | null;
  breath_control_score: number | null;
  resonance_score: number | null;
  corrective_prompts: string[] | null;
  created_at: string;
}

export interface SessionsResponse {
  sessions: Session[];
  total_count: number;
  has_more: boolean;
}

export interface SessionDetail {
  id: string;
  duration_seconds: number;
  pitch_accuracy_score: number | null;
  breath_control_score: number | null;
  resonance_score: number | null;
  corrective_prompts: string[] | null;
  created_at: string;
}

export interface WeekCount {
  count: number;
  limit: number;
  remaining: number;
}

export interface PracticePlan {
  id: string;
  exercises: PracticePlanExercise[];
  generated_at: string;
}

export interface PracticePlanExercise {
  title: string;
  description: string;
  duration_minutes: number;
  instructions: string;
}

export interface ProgressData {
  date: string;
  pitch_accuracy: number;
  breath_control: number;
  resonance: number;
}

export interface ExerciseLibrary {
  library_name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
}

export interface UserSettings {
  display_name: string | null;
  coaching_receipt_opt_out: boolean | null;
}

export interface OnboardingStatus {
  onboarding_complete: boolean;
}

export interface CheckoutResponse {
  price_id: string;
  client_token: string;
}

export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type Goal = "pitch accuracy" | "breath control" | "general improvement";
export type Genre = "pop" | "classical" | "jazz" | "other";

export type BillingInterval = "monthly" | "yearly";
export type Tier = "free" | "pro" | "plus";
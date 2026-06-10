"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Switch } from "../../components/ui/switch";
import { useAuth } from "@/app/_components/AuthProvider";
import { paymentsApi, authApi } from "@/app/_lib/api";
import type { Tier, BillingInterval } from "@/app/_lib/types";
import { Check, Loader2, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    id: "free" as Tier,
    name: "Free",
    price: 0,
    description: "Perfect for trying out",
    features: [
      "5 recordings per week",
      "Basic pitch accuracy score",
      "7-day session history",
    ],
    cta: "Current Plan",
    current: true,
  },
  {
    id: "pro" as Tier,
    name: "Pro",
    priceMonthly: 12,
    priceYearly: 99,
    savings: 31,
    description: "For serious learners",
    features: [
      "Unlimited recordings",
      "Full feedback (pitch + breath + resonance)",
      "Corrective coaching tips",
      "Personalized practice plans",
      "90-day session history",
      "Streak tracking",
      "2 exercise libraries",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "plus" as Tier,
    name: "Plus",
    priceMonthly: 29,
    priceYearly: 249,
    savings: 28,
    description: "The complete experience",
    features: [
      "Everything in Pro",
      "Genre-specific feedback mode",
      "12-week progress charts",
      "Weekly coaching receipt email",
      "Priority support",
      "Early access to new features",
      "All 3 exercise libraries",
    ],
    cta: "Upgrade to Plus",
  },
];

function PricingContent() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const handleCheckout = async (tier: Tier) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoadingCheckout(tier);
    try {
      const { price_id, client_token } = await paymentsApi.checkout(tier, billingInterval);

      const paddle = (window as any).Paddle;
      if (paddle) {
        paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: "overlay" },
        });
      } else {
        console.error("Paddle not loaded");
        alert("Payment system not ready. Please refresh and try again.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoadingCheckout(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const currentTier = user?.tier || "free";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-2 text-gray-500">Start free, upgrade when you&apos;re ready</p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          <span className={`text-sm ${billingInterval === "monthly" ? "font-medium text-gray-900" : "text-gray-500"}`}>
            Monthly
          </span>
          <Switch
            checked={billingInterval === "yearly"}
            onCheckedChange={(checked) => setBillingInterval(checked ? "yearly" : "monthly")}
          />
          <span className={`text-sm ${billingInterval === "yearly" ? "font-medium text-gray-900" : "text-gray-500"}`}>
            Yearly
          </span>
          {billingInterval === "yearly" && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Save up to 31%
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => {
            const isCurrentTier = currentTier === tier.id;
            const isUpgrade = (tier.id === "pro" && currentTier === "free") || 
                              (tier.id === "plus" && (currentTier === "free" || currentTier === "pro"));
            const price = tier.id === "free" 
              ? 0 
              : billingInterval === "monthly" 
                ? tier.priceMonthly 
                : tier.priceYearly;

            return (
              <Card
                key={tier.id}
                className={`relative border-gray-200 ${tier.id === "plus" ? "ring-2 ring-gray-900" : ""}`}
              >
                {tier.id === "plus" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                      <Crown className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    {tier.id === "free" ? (
                      <p className="text-3xl font-bold text-gray-900">Free</p>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-gray-900">${price}</p>
                        <p className="text-sm text-gray-500">
                          {billingInterval === "yearly" ? "/year" : "/month"}
                        </p>
                      </>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isCurrentTier ? "outline" : tier.id === "plus" ? "default" : "default"}
                    disabled={isCurrentTier || loadingCheckout === tier.id}
                    onClick={() => !isCurrentTier && handleCheckout(tier.id)}
                  >
                    {loadingCheckout === tier.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCurrentTier ? (
                      "Current Plan"
                    ) : (
                      tier.cta
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Questions? <a href="mailto:support@voicecoach.ai" className="text-gray-900 underline">Contact us</a>
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
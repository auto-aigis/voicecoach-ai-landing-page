"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Mic,
  BarChart3,
  Brain,
  Calendar,
  Check,
  ChevronRight,
  Globe,
  Headphones,
  Music,
  Play,
  Star,
  Zap,
} from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge: string | null;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Page() {
  const features: Feature[] = [
    {
      icon: <BarChart3 className="h-6 w-6 text-violet-500" />,
      title: "Pitch Accuracy Map",
      description:
        "See exactly where you hit or missed every note with a visual pitch map that tracks your performance in real time.",
    },
    {
      icon: <Headphones className="h-6 w-6 text-violet-500" />,
      title: "Breath Control Analysis",
      description:
        "AI detects your breath timing, identifies where you run out of air, and suggests phrasing improvements.",
    },
    {
      icon: <Music className="h-6 w-6 text-violet-500" />,
      title: "Resonance & Tone Score",
      description:
        "Get a detailed quality score on your vocal tone, resonance placement, and overall sound richness.",
    },
    {
      icon: <Brain className="h-6 w-6 text-violet-500" />,
      title: "NLP Coach Report",
      description:
        "Receive a personalized written report after every session — like getting notes from a real vocal coach.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-violet-500" />,
      title: "Weekly Practice Plan",
      description:
        "AI generates a custom weekly practice plan based on your strengths, weaknesses, and goals.",
    },
    {
      icon: <Globe className="h-6 w-6 text-violet-500" />,
      title: "100% Browser-Based",
      description:
        "No downloads, no apps. Just open your browser, hit record, and start improving your voice instantly.",
    },
  ];

  const steps: Step[] = [
    {
      number: 1,
      title: "Record Yourself",
      description: "Sing any song or vocal exercise directly in your browser. No setup required.",
      icon: <Mic className="h-8 w-8 text-white" />,
    },
    {
      number: 2,
      title: "Get AI Analysis",
      description:
        "Our AI analyzes pitch, breath, resonance, and tone in seconds with detailed visual feedback.",
      icon: <Zap className="h-8 w-8 text-white" />,
    },
    {
      number: 3,
      title: "Read Your Coach Report",
      description:
        "Receive a personalized NLP-generated report with actionable tips and a practice plan.",
      icon: <Star className="h-8 w-8 text-white" />,
    },
  ];

  const pricing: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try VoiceCoach AI with limited recordings per month.",
      features: [
        "3 recordings per month",
        "Basic pitch accuracy feedback",
        "Tone quality score",
        "Browser-based recording",
      ],
      highlighted: false,
      badge: null,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "Full AI coaching experience for serious hobbyists.",
      features: [
        "Unlimited recordings",
        "Full pitch map visualization",
        "Breath control analysis",
        "Resonance & tone scoring",
        "NLP coach report after every session",
        "Personalized weekly practice plan",
        "Progress tracking dashboard",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Annual",
      price: "$99",
      period: "per year",
      description: "Save 31% with annual billing. Same Pro features.",
      features: [
        "Everything in Pro",
        "Save $45 per year",
        "Priority AI processing",
        "Early access to new features",
        "Export session history",
      ],
      highlighted: false,
      badge: "Best Value",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "Do I need any special equipment?",
      answer:
        "No! Any device with a microphone works. A laptop mic, phone mic, or USB microphone will all produce results. Better mics give slightly more accurate tone analysis, but the AI adapts to any input quality.",
    },
    {
      question: "How accurate is the AI feedback compared to a real vocal coach?",
      answer:
        "Our AI has been trained on thousands of vocal performances and validated against professional vocal coaches. While it cannot replace in-person lessons for advanced technique, it provides detailed and actionable feedback that matches what a coach would tell you about pitch, breath, and tone.",
    },
    {
      question: "Can I sing any song or just pre-loaded exercises?",
      answer:
        "You can sing absolutely anything — any song, any genre, any vocal exercise. The AI analyzes your vocal performance regardless of what you choose to sing.",
    },
    {
      question: "Is my voice data private and secure?",
      answer:
        "Yes. Your recordings are encrypted and processed securely. We never share your audio with third parties. You can delete your recordings at any time from your dashboard.",
    },
    {
      question: "What makes this different from other singing apps?",
      answer:
        "VoiceCoach AI is the only browser-based tool that gives you a full NLP-generated coach report with pitch mapping, breath timing analysis, and resonance scoring. Other apps are mobile-only, lack depth, or are overpriced multi-instrument platforms.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Mic className="h-7 w-7 text-violet-600" />
            <span className="text-xl font-bold text-gray-900">VoiceCoach AI</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Sign In
              </Button>
            </a>
            <a href="/register">
              <Button className="bg-violet-600 text-sm font-medium text-white hover:bg-violet-700">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-200 opacity-30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-200 opacity-30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-violet-100 text-violet-700 hover:bg-violet-100">
            <Zap className="mr-1 h-3 w-3" /> Now in Public Beta
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Your Personal AI Vocal Coach —{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Real Feedback, No Lessons
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Record yourself singing any song in your browser and get instant AI-powered feedback on pitch accuracy, breath control, resonance, and vocal tone — with a personalized weekly practice plan.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/register">
              <Button size="lg" className="bg-violet-600 px-8 text-base font-semibold text-white hover:bg-violet-700">
                Get Started Free
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="px-8 text-base font-semibold">
                <Play className="mr-2 h-4 w-4" />
                See How It Works
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • Works in any modern browser
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything a vocal coach would tell you — powered by AI
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get professional-level vocal analysis without booking expensive lessons or downloading apps.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-gray-200 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100">How It Works</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Three simple steps to better singing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No setup, no downloads, no scheduling. Just sing and improve.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                  {step.icon}
                </div>
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-600">
                  Step {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100">Pricing</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Priced like Netflix, not like vocal lessons
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A single vocal lesson costs $50–$150. Get unlimited AI coaching for less than a single session.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricing.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.highlighted
                    ? "border-violet-300 shadow-xl ring-2 ring-violet-200"
                    : "border-gray-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white hover:bg-violet-600">{tier.badge}</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="ml-1 text-gray-500">/{tier.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-violet-600 text-white hover:bg-violet-700"
                          : ""
                      }`}
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about VoiceCoach AI.
            </p>
          </div>
          <div className="mt-12">
            <Accordion className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Final CTA Section */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 px-8 py-16 text-center shadow-2xl sm:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start singing better today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
            Join thousands of hobbyist singers who are improving their voice with AI-powered feedback. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/register">
              <Button size="lg" className="bg-white px-8 text-base font-semibold text-violet-700 hover:bg-gray-100">
                Get Started Free
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-violet-200">
            Free plan includes 3 recordings per month
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-violet-600" />
              <span className="text-lg font-bold text-gray-900">VoiceCoach AI</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 VoiceCoach AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
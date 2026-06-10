"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface UpgradePromptProps {
  title: string;
  description: string;
}

export function UpgradePrompt({ title, description }: UpgradePromptProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-500">{description}</p>
        <Button asChild>
          <a href="/pricing">Upgrade to Pro</a>
        </Button>
      </CardContent>
    </Card>
  );
}
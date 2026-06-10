"use client";

import { useEffect, useState } from "react";

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!clientToken) {
      console.warn("Paddle client token not configured");
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      const paddle = (window as any).Paddle;
      if (paddle) {
        paddle.Environment.set(process.env.NODE_ENV === "production" ? "production" : "sandbox");
        paddle.Initialize({ token: clientToken });
        setLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return <>{children}</>;
}
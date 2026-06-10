"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell } from "@/app/_components/AppShell";
import { useAuth } from "@/app/_components/AuthProvider";
import { sessionsApi } from "@/app/_lib/api";
import type { WeekCount } from "@/app/_lib/types";
import { Mic, Square, Pause, Play, Loader2, AlertCircle, CheckCircle } from "lucide-react";

const MIN_DURATION = 30;
const MAX_DURATION = 180;

export default function RecordPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [weekCount, setWeekCount] = useState<WeekCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  const canAccessFull = user?.tier === "pro" || user?.tier === "plus";

  useEffect(() => {
    const fetchWeekCount = async () => {
      try {
        const count = await sessionsApi.weekCount();
        setWeekCount(count);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user) {
      fetchWeekCount();
    }
  }, [user, authLoading]);

  const isLimited = !canAccessFull && weekCount && weekCount.remaining <= 0;

  const drawWaveform = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = recording && !paused ? "#374151" : "#9ca3af";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    if (recording && !paused) {
      animationRef.current = requestAnimationFrame(drawWaveform);
    }
  }, [recording, paused]);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(100);
      setRecording(true);
      setDuration(0);
      drawWaveform();

      timerRef.current = window.setInterval(() => {
        setDuration((d) => {
          if (d >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      setPermissionDenied(true);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recording) {
      if (paused) {
        mediaRecorderRef.current.resume();
        timerRef.current = window.setInterval(() => {
          setDuration((d) => d + 1);
        }, 1000);
        drawWaveform();
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      }
      setPaused(!paused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      setRecording(false);
      setPaused(false);
    }
  };

  const handleSubmit = async () => {
    if (duration < MIN_DURATION) {
      setError(`Recording must be at least ${MIN_DURATION} seconds`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(",")[1];

        try {
          const session = await sessionsApi.create(duration, base64data);
          router.push(`/dashboard/session/${session.id}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Upload failed";
          if (msg.includes("weekly_limit_exceeded")) {
            setError("You've used your 5 free sessions this week. Upgrade to Pro for unlimited!");
          } else {
            setError(msg);
          }
        } finally {
          setUploading(false);
        }
      };
    } catch (err) {
      setError("Failed to process recording");
      setUploading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AppShell>
    );
  }

  if (permissionDenied) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md text-center">
          <Card className="border-red-200">
            <CardHeader>
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <CardTitle className="mt-4">Microphone Access Required</CardTitle>
              <CardDescription>
                Please allow microphone access in your browser settings to record your voice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setPermissionDenied(false)}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (isLimited) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md text-center">
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
              <CardTitle className="mt-4">Weekly Limit Reached</CardTitle>
              <CardDescription>
                You&apos;ve used your 5 free sessions this week. Upgrade to Pro for unlimited recordings!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild>
                <a href="/pricing">Upgrade to Pro</a>
              </Button>
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Practice Session</h1>
          <p className="text-gray-500">
            {!canAccessFull && weekCount && (
              <span>{weekCount.remaining} of 5 free sessions remaining this week. </span>
            )}
            Record 30 seconds to 3 minutes
          </p>
        </div>

        <Card className="border-gray-200">
          <CardContent className="flex flex-col items-center py-8">
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="mb-6 w-full max-w-md rounded-lg bg-gray-100"
            />

            <div className="mb-6 text-center">
              <p className="text-4xl font-bold text-gray-900">{formatDuration(duration)}</p>
              <p className="text-sm text-gray-500">
                {duration < MIN_DURATION
                  ? `${MIN_DURATION - duration}s minimum required`
                  : "Ready to submit"}
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              {!recording ? (
                <Button size="lg" onClick={startRecording} className="gap-2">
                  <Mic className="h-5 w-5" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="lg" onClick={pauseRecording} className="gap-2">
                    {paused ? (
                      <>
                        <Play className="h-5 w-5" /> Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-5 w-5" /> Pause
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={stopRecording}
                    className="gap-2"
                  >
                    <Square className="h-5 w-5" />
                    Stop
                  </Button>
                </>
              )}
            </div>

            {recording && duration >= MIN_DURATION && (
              <Button
                size="lg"
                className="mt-6 gap-2"
                onClick={handleSubmit}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" /> Submit Recording
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
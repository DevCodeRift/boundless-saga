"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function getDeviceFingerprint() {
  return window.localStorage.getItem("deviceFingerprint") || "demo-device-fingerprint";
}
function getBrowserFingerprint() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
  };
}

function DiscordOAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Missing code from Discord");
      return;
    }
    const deviceFingerprint = getDeviceFingerprint();
    const browserFingerprint = getBrowserFingerprint();
    fetch("/api/auth/discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, deviceFingerprint, browserFingerprint }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(err.error || "Unknown error");
        }
        router.replace("/dashboard");
      })
      .catch((e) => setError(e.message));
  }, [router, searchParams]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Completing Discord Login...</h1>
      {error && <div className="text-red-500">{error}</div>}
      {!error && <div className="text-gray-500">Please wait, redirecting...</div>}
    </main>
  );
}

export default function DiscordOAuthCallbackPage() {
  return (
    <Suspense>
      <DiscordOAuthCallbackInner />
    </Suspense>
  );
}

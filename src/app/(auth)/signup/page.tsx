"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleOAuthSignup = async (provider: "google" | "github") => {
    setIsLoading(provider);
    const { origin } = window.location;
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Content Forge</h1>
          <p className="text-muted-foreground text-sm">
            새 계정을 만드세요
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignup("google")}
            disabled={isLoading !== null}
          >
            {isLoading === "google" ? "가입 중..." : "Google로 가입하기"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignup("github")}
            disabled={isLoading !== null}
          >
            {isLoading === "github" ? "가입 중..." : "GitHub로 가입하기"}
          </Button>
        </div>

        <p className="text-muted-foreground text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-foreground underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

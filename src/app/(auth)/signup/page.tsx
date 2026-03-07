import Link from "next/link";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Content Forge</h1>
          <p className="text-muted-foreground text-sm">
            새 계정을 만드세요
          </p>
        </div>

        <SocialLoginButtons mode="signup" />

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

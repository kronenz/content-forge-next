import Link from "next/link";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Content Forge</h1>
          <p className="text-muted-foreground text-sm">
            계정에 로그인하세요
          </p>
        </div>

        <SocialLoginButtons mode="login" />

        <p className="text-muted-foreground text-center text-sm">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-foreground underline">
            가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}

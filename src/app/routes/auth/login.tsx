import { SmokeEffect } from "@/components/effects/smoke-effect";
import { Head } from "@/components/seo/head";
import { BodyText, Heading5 } from "@/components/typography";
import { paths } from "@/config/paths";
import { LoginForm } from "@/features/auth/components/login-form";
import { useNavigate } from "react-router";

export const LoginRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <Head
        title="Masuk"
        description="Masuk ke lockbox untuk mengatur password kamu."
      />

      <header className="relative z-10 border-b">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <div className="shrink-0">
            <Heading5
              onClick={() => {
                navigate(paths.landing.path);
              }}
              className="cursor-pointer"
            >
              <span className="text-neon-green">Lock</span>
              Box
            </Heading5>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex items-center justify-center h-180">
        <LoginForm />
      </main>

      <SmokeEffect />

      <footer className="absolute bottom-0 z-10 mt-10 flex h-16 w-full shrink-0 items-center justify-center border bg-transparent">
        <BodyText className="text-center text-sm">
          &copy; 2026 LockBox. All Rights Reserved.
        </BodyText>
      </footer>
    </div>
  );
};

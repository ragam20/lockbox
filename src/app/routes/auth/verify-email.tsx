import { SmokeEffect } from "@/components/effects/smoke-effect";
import { Head } from "@/components/seo/head";
import { BodyText } from "@/components/typography";
import { AppTitle } from "@/components/ui/text/title";
import { paths } from "@/config/paths";
import { VerifyEmail } from "@/features/auth/components/verify-email";
import { Navigate, useSearchParams } from "react-router";

export const VerifyEmailRoute = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  if (!token) {
    return <Navigate to={paths.auth.register.getHref()} replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void">
      <Head title="Verfikasi Email" description="" />

      <header className="relative z-10 border-b">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <AppTitle />
        </nav>
      </header>

      <main className="flex items-center justify-center h-160">
        <VerifyEmail token={token} />
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

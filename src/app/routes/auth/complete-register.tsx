import { SmokeEffect } from "@/components/effects/smoke-effect";
import { Head } from "@/components/seo/head";
import { BodyText } from "@/components/typography";
import { AppTitle } from "@/components/ui/text/title";
import { paths } from "@/config/paths";
import { CompleteRegister } from "@/features/auth/components/complete-register";
import { Navigate, useSearchParams } from "react-router";

export const CompleteRegisterRoute = () => {
  const [searchParams] = useSearchParams();

  const session = searchParams.get("session");

  if (!session) {
    return <Navigate to={paths.auth.register.getHref()} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void">
      <Head title="Registrasi" description="" />

      <header className="relative z-10 border-b">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <AppTitle />
        </nav>
      </header>

      <main className="flex items-center justify-center h-160">
        <CompleteRegister session={session} />
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

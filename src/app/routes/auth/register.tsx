import { SmokeEffect } from "@/components/effects/smoke-effect";
import { Head } from "@/components/seo/head";
import { Heading5 } from "@/components/typography";
import { paths } from "@/config/paths";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useNavigate } from "react-router";

export const RegisterRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <Head
        title="Daftar"
        description="Bergabung bersama lockbox untuk menyimpan dan mengatur password dan catatan kamu secara aman."
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

      <main className="relative z-10 max-w-6xl w-full md:w-6xl h-140 mx-auto flex items-center">
        <section className="m-auto">
          <RegisterForm />
        </section>
      </main>

      <SmokeEffect />
    </div>
  );
};

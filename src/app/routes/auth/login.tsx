import { SmokeEffect } from "@/components/effects/smoke-effect";
import { Head } from "@/components/seo/head";
import { Heading5 } from "@/components/typography";
import { paths } from "@/config/paths";
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

      <main className="relative z-10"></main>

      <SmokeEffect />
    </div>
  );
};

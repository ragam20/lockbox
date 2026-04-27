import { SmokeEffect } from "@/components/effects/smoke-effect";
import { Heading5 } from "@/components/typography";
import { RegisterForm } from "@/features/auth/components/register-form";

export const RegisterRoute = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <header className="relative z-10 border-b">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <div className="shrink-0">
            <Heading5 className="cursor-pointer">
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

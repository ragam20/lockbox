import { Head } from "@/components/seo/head";
import { BodyText, Heading1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { PasswordGeneratorBox } from "@/components/ui/password-generator-box";
import { AppTitle } from "@/components/ui/text/title";
import { paths } from "@/config/paths";
import { useNavigate } from "react-router";
import Typewriter from "typewriter-effect";

export const LandingRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden">
      <Head
        title=""
        description="LockBox adalah aplikasi modern untuk menyimpan catatan penting dan password secara aman, cepat, dan terenkripsi agar data pribadi Anda tetap terlindungi."
      />
      <header className="border-b">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <AppTitle />
          <div className="flex shrink-0 gap-3">
            <Button
              onClick={() => {
                navigate(paths.auth.otp.path);
              }}
              className="text-void bg-[#d4d4d8] py-4 px-8 rounded-md cursor-pointer hover:bg-white"
            >
              Masuk
            </Button>
            <Button
              onClick={() => {
                navigate(paths.auth.register.path);
              }}
              variant={"outline"}
              className="py-4 px-8 rounded-md cursor-pointer hover:bg-neon-green hover:text-void"
            >
              Daftar
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section
          id="hero-section"
          className="md:mx-auto max-w-6xl mt-24 flex flex-col gap-4"
        >
          <Heading1 className="text-center">
            <span>
              <Typewriter
                options={{
                  strings: [
                    "“Pusing mikirin banyak password?”",
                    "“Simpan di LockBox agar data kamu aman.”",
                    "“Data kamu terenkripsi dengan baik.”",
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 200,
                  deleteSpeed: 80,
                }}
              />
            </span>
          </Heading1>
          <BodyText className="text-center  md:w-2xl mx-auto text-[#a1a1aa]">
            Lockbox membantu kamu mengelola password dengan aman dan
            praktis—tanpa perlu repot mengingat semuanya
          </BodyText>
          <Button
            onClick={() => {
              navigate(paths.auth.otp.path);
            }}
            variant={"outline"}
            className="mt-4 mx-auto border-neon-green p-6 px-16 rounded-md cursor-pointer w-fit hover:bg-neon-green hover:text-void"
          >
            Mulai
          </Button>
        </section>

        <section
          id="password-generator-box"
          className="p-6 mx-auto xl:w-300 mt-8 md:mt-46"
        >
          <PasswordGeneratorBox />
        </section>
      </main>

      <footer className="mt-10 flex h-16 w-full shrink-0 items-center justify-center border">
        <BodyText className="text-center text-sm">
          &copy; 2026 LockBox. All Rights Reserved.
        </BodyText>
      </footer>
    </div>
  );
};

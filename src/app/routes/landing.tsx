import { Head } from "@/components/seo/head";
import { BodyText, Heading1, Heading5 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { PasswordGeneratorBox } from "@/components/ui/password-generator-box";
import Typewriter from "typewriter-effect";

export const LandingRoute = () => {
  return (
    <div className="overflow-hidden mb-56">
      <Head title="Landing" description="lockbox landing" />
      <header className="border-b">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <div className="shrink-0">
            <Heading5 className="cursor-pointer">
              <span className="text-neon-green">Lock</span>
              Box
            </Heading5>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button className="text-void bg-[#d4d4d8] py-4 px-8 rounded-md cursor-pointer hover:bg-white">
              Masuk
            </Button>
            <Button
              variant={"outline"}
              className="py-4 px-8 rounded-md cursor-pointer hover:bg-neon-green hover:text-void"
            >
              Daftar
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section
          id="hero-section"
          className="md:mx-auto max-w-6xl mt-24 flex flex-col gap-4"
        >
          <Heading1 className="text-center">
            <span>
              <Typewriter
                options={{
                  strings: [
                    "“Zero-Knowledge Security”",
                    "“Keamanan di tangan kamu. Privasi tetap milik kamu.”",
                    "“Berhenti pusing mikirin banyak password.”",
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
            variant={"outline"}
            className="mt-4 mx-auto border-neon-green p-6 px-16 rounded-md cursor-pointer w-fit hover:bg-neon-green hover:text-void"
          >
            Mulai
          </Button>
        </section>

        <section
          id="password-generator-box"
          className="p-6 mx-auto xl:w-300 mt-26 md:mt-46"
        >
          <PasswordGeneratorBox />
        </section>
      </main>
    </div>
  );
};

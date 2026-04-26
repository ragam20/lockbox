"use client";
import Typewriter from "typewriter-effect";

export function HeroTypewriter() {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold text-[var(--dark-forest)]">
        <Typewriter
          options={{
            strings: [
              "Zero-Knowledge Security",
              "Keamanan di tangan kamu. Privasi tetap milik kamu.",
              "Berhenti pusing mikirin banyak password.",
            ],
            autoStart: true,
            loop: true,
            deleteSpeed: 40,
            delay: 70,
          }}
        />
      </h1>
    </div>
  );
}

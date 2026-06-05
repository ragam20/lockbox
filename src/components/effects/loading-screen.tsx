import { ShieldIC } from "@/components/ic/shield-ic";
import { cn } from "@/lib/utils";
import type React from "react";

type LoadingScreenProps = {
  className?: string;
  label?: string;
  children?: React.ReactNode;
};

export const LoadingScreen = ({
  className,
  label = "Memuat...",
  children,
}: LoadingScreenProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "h-screen flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-md border border-forest/60 bg-forest/10 px-6 py-10",
        className,
      )}
    >
      <ShieldIC
        animated
        className="size-24 drop-shadow-[0_0_10px_rgba(54,244,164,0.35)] motion-reduce:drop-shadow-none"
      />
      {children ? (
        children
      ) : (
        <p className="text-md font-semibold text-center text-white/70">
          {label}
        </p>
      )}
    </div>
  );
};

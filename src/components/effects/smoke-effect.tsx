import { cn } from "@/lib/utils";

type SmokeEffectProps = {
  className?: string;
};

export const SmokeEffect = ({ className }: SmokeEffectProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-0 h-104 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-44"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="absolute left-1/2 -bottom-24 h-64 w-120 -translate-x-1/2 rounded-full opacity-95 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(130,237,88,0.88) 0%, rgba(130,237,88,0.42) 36%, rgba(130,237,88,0.12) 58%, rgba(0,0,0,0) 78%)",
        }}
      />
      <div
        className="absolute left-[22%] -bottom-28 h-52 w-72 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(130,237,88,0.52) 0%, rgba(130,237,88,0.16) 55%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        className="absolute right-[18%] -bottom-32 h-56 w-80 rounded-full opacity-75 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(130,237,88,0.48) 0%, rgba(130,237,88,0.14) 54%, rgba(0,0,0,0) 82%)",
        }}
      />
      <div
        className="absolute left-1/2 -bottom-44 h-80 w-6xl -translate-x-1/2 rounded-full opacity-90 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0.96) 18%, rgba(0,0,0,0.82) 43%, rgba(0,0,0,0.22) 70%, rgba(0,0,0,0) 86%)",
        }}
      />
    </div>
  );
};

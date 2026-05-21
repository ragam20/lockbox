import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type FailedAnimationProps = {
  className?: string;
};

export const FailedAnimation = ({ className }: FailedAnimationProps) => {
  return (
    <div className={cn("w-64", className)}>
      <DotLottieReact
        src="/animations/anim-failed.json"
        autoplay
        loop={false}
      />
    </div>
  );
};

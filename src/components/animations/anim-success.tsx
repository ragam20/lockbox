import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type SuccessAnimationProps = {
  className?: string;
};

export const SuccessAnimation = ({ className }: SuccessAnimationProps) => {
  return (
    <div className={cn("w-64", className)}>
      <DotLottieReact
        src="/animations/anim-success.json"
        autoplay
        loop={false}
      />
    </div>
  );
};

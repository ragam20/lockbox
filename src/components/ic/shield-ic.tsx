import { cn } from "@/lib/utils";

type ShieldICProps = {
  className?: string;
  stroke?: string;
  animated?: boolean;
};

const SHIELD_PATH = "M12 2L19 5V11C19 16 16 20 12 22C8 20 5 16 5 11V5Z";

export const ShieldIC = ({
  stroke,
  className,
  animated = false,
}: ShieldICProps) => {
  const baseStroke = stroke ?? "#36f4a4";

  return (
    <svg className={cn("size-4", className)} viewBox="0 0 24 24" fill="none">
      <path
        d={SHIELD_PATH}
        stroke={animated ? "#22382f" : baseStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {animated ? (
        <path
          d={SHIELD_PATH}
          pathLength={100}
          stroke={baseStroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="18 82"
          strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-100"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </path>
      ) : null}
    </svg>
  );
};

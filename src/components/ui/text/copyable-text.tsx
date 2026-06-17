import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

type CopyAbleTextProps = {
  text: string;
  className?: string;
  fontStyle?: string;
  iconStyle?: string;
};

export const CopyAbleText = ({
  text,
  className,
  fontStyle,
  iconStyle,
}: CopyAbleTextProps) => {
  const [isCopy, setIsCopy] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setIsCopy(true);

      setTimeout(() => {
        setIsCopy(false);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={cn("flex gap-2 text-blue-700 items-center", className)}>
      {isCopy ? (
        <CheckIcon
          className={cn("size-4 cursor-pointer", iconStyle)}
          onClick={() => {
            handleCopy();
          }}
        />
      ) : (
        <CopyIcon
          className={cn("size-4 cursor-pointer", iconStyle)}
          onClick={() => {
            handleCopy();
          }}
        />
      )}
      <p className={cn("text-sm", fontStyle)}>{text}</p>
    </div>
  );
};

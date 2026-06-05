import { ShieldIC } from "@/components/ic/shield-ic";
import { Heading5 } from "@/components/typography";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

type IcSize = "xs" | "md" | "xl";

type TitleAppProps = {
  canNavigate?: boolean;
  icSize?: IcSize;
  classname?: string;
};
export const AppTitle = ({
  canNavigate,
  icSize = "md",
  classname,
}: TitleAppProps) => {
  const icSz =
    icSize === "xs" ? "size-4" : icSize === "md" ? "size-8" : "size-16";
  const navigate = useNavigate();

  const handleClick = () => {
    if (!canNavigate) return;

    navigate("/");
  };

  return (
    <div
      onClick={handleClick}
      className={cn("shrink-0 flex gap-2 items-center", classname)}
    >
      <ShieldIC className={icSz} />
      <Heading5 className="cursor-pointer">
        <span className="text-neon-green">Lock</span>
        Box
      </Heading5>
    </div>
  );
};

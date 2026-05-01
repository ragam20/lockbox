import { BodyText } from "@/components/typography";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Separator } from "../separator";

type AvatarPopoverProps = {
  manages?: () => void;
  lock?: () => void;
  logout?: () => void;
  children?: React.ReactNode;
};

export const AvatarPopover = ({
  manages,
  lock,
  logout,
  children,
}: AvatarPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent align="start">
        <div className="flex flex-col gap-2">
          <BodyText
            onClick={manages}
            className="bg-transparent hover:bg-forest py-2 px-4 text-sm cursor-pointer"
          >
            Pengaturan akun
          </BodyText>

          <BodyText
            onClick={lock}
            className="w-full bg-transparent hover:bg-forest py-2 px-4 text-sm cursor-pointer"
          >
            Kunci
          </BodyText>

          <Separator className="w-full" />

          <BodyText
            onClick={logout}
            className="w-full bg-transparent hover:bg-forest py-2 px-4 text-sm cursor-pointer"
          >
            Keluar
          </BodyText>
        </div>
      </PopoverContent>
    </Popover>
  );
};

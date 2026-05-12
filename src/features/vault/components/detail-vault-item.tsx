import type { VaultItemLogin, VaultItemNote } from "@/types/api";
import { DetailLogin } from "./detail-login";
import { DetailNote } from "./detail-note";

export type VaultDetailItemByType = {
  web: VaultItemLogin & { type: "web" };
  note: VaultItemNote & { type: "note" };
};

export type VaultDetailItem =
  VaultDetailItemByType[keyof VaultDetailItemByType];

type VaultItemDetailProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  item: VaultDetailItem | null;
};

export const VaultItemDetail = ({
  open,
  onOpenChange,
  item,
}: VaultItemDetailProps) => {
  if (!item) return null;

  if (item.type === "web") {
    return (
      <DetailLogin open={open} onOpenChange={onOpenChange} item={item} />
    );
  }

  return <DetailNote open={open} onOpenChange={onOpenChange} item={item} />;
};

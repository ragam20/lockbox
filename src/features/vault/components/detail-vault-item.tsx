import type { VaultItemPassword, VaultItemNote } from "@/types/entity";
import { DetailPassword } from "./detail-password";
import { DetailNote } from "./detail-note";

export type VaultDetailItemByType = {
  web: VaultItemPassword & { type: "web" };
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
      <DetailPassword open={open} onOpenChange={onOpenChange} item={item} />
    );
  }

  return <DetailNote open={open} onOpenChange={onOpenChange} item={item} />;
};

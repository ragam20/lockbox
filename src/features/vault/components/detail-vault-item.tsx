import type { VaultItem } from "@/types/entity";
import { DetailPassword } from "./detail-password";
import { DetailNote } from "./detail-note";
import { DetailApiKey } from "./detail-api-key";

type VaultItemDetailProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  item: VaultItem | null;
};

export const VaultItemDetail = ({
  open,
  onOpenChange,
  item,
}: VaultItemDetailProps) => {
  if (!item) return null;

  if (item.itemType === "password") {
    return (
      <DetailPassword
        open={open}
        onOpenChange={onOpenChange}
        vaultItem={item}
      />
    );
  }

  if (item.itemType === "apiKey") {
    return (
      <DetailApiKey
        open={open}
        onOpenChange={onOpenChange}
        vaultItem={item}
      />
    );
  }

  return (
    <DetailNote open={open} onOpenChange={onOpenChange} vaultItem={item} />
  );
};

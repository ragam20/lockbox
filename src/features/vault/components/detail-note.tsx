import { BodyText, Heading5 } from "@/components/typography";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import type { VaultItemNote } from "@/types/entity";

type DetailNoteProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  item: VaultItemNote | null;
};

export const DetailNote = ({ open, onOpenChange, item }: DetailNoteProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100 mb-8">
        <DialogHeader>
          <Heading5>Detail Catatan</Heading5>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">Judul</p>
          <BodyText className="text-sm">{item.title}</BodyText>

          <p className="text-sm text-gray-500">Description</p>
          <div className="max-h-65 overflow-y-auto">
            <BodyText className="text-sm">{item.description}</BodyText>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Dibuat</p>
              <BodyText className="text-sm">{item.createdAt}</BodyText>
            </div>

            <div>
              <p className="text-sm text-gray-500">Diperbarui</p>
              <BodyText className="text-sm">{item.updatedAt}</BodyText>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

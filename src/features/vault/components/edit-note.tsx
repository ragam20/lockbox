import { Heading5 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import type { VaultItemNote } from "@/types/api";
import { z } from "zod";

const editNoteSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

type EditNoteValues = z.output<typeof editNoteSchema>;

type EditNoteProps = {
  open: boolean;
  item: VaultItemNote | null;
  onOpenChange: (state: boolean) => void;
  onSubmit: (item: VaultItemNote) => void;
};

export const EditNote = ({
  open,
  item,
  onOpenChange,
  onSubmit,
}: EditNoteProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <Heading5>Ubah Catatan</Heading5>
        </DialogHeader>

        <Form
          key={item.id}
          id="edit-note-id"
          className="my-4 flex flex-col"
          schema={editNoteSchema}
          defaultValues={{
            title: item.title,
            description: item.description ?? "",
          }}
          onSubmit={(values: EditNoteValues) => {
            onSubmit({
              ...item,
              title: values.title,
              description: values.description ?? "",
            });
            onOpenChange(false);
          }}
        >
          {({ register, errors }) => (
            <>
              <FormField label="Judul" error={errors.title}>
                <Input
                  className="py-5"
                  placeholder="masukan judul"
                  {...register("title")}
                />
              </FormField>

              <FormField label="Deskripsi" error={errors.description}>
                <textarea
                  placeholder="tulis catatan"
                  className="h-36 w-full rounded-md border border-input bg-transparent p-4 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  {...register("description")}
                />
              </FormField>
            </>
          )}
        </Form>

        <DialogFooter className="flex-col items-center gap-4 sm:flex-col xl:flex-row xl:justify-end">
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
            }}
            className="w-full cursor-pointer rounded-md bg-red-600 text-white hover:bg-red-800 xl:w-fit"
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="edit-note-id"
            className="w-full cursor-pointer rounded-md xl:w-fit"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

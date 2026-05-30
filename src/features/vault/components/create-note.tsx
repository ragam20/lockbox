import { Heading5 } from "@/components/typography";
import { Button, SubmitButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const inputNoteSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

type CreateNoteProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
};

export const CreateNote = ({ open, onOpenChange }: CreateNoteProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <Heading5>Catatan Baru</Heading5>
        </DialogHeader>
        <Form
          id="create-note-id"
          className="my-4 flex flex-col"
          onSubmit={() => {}}
          schema={inputNoteSchema}
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
                />
              </FormField>
            </>
          )}
        </Form>

        <DialogFooter className="flex-col items-center gap-4 sm:flex-col xl:flex-row xl:justify-end">
          <Button
            onClick={() => {
              onOpenChange(false);
            }}
            className="w-full cursor-pointer rounded-md bg-red-600 text-white hover:bg-red-800 xl:w-fit"
          >
            Batal
          </Button>
          <SubmitButton className="w-full cursor-pointer rounded-md xl:w-fit">
            Buat
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

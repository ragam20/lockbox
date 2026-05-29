import { Heading5 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Form, FormField, PasswordFormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import z from "zod";

const createPasswordSchema = z.object({
  title: z.string(),
  password: z.string(),
  url: z.string().refine((val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Invalid URL"),
  description: z.string().optional(),
});

type CreateLoginProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
};

export const CreatePassword = ({ open, onOpenChange }: CreateLoginProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <Heading5>Password Baru</Heading5>
        </DialogHeader>

        <Form
          id="create-login-id"
          className="my-4 flex flex-col"
          schema={createPasswordSchema}
          onSubmit={() => {}}
        >
          {({ register, errors }) => (
            <>
              <FormField label="judul" error={errors.title}>
                <Input
                  className="py-5"
                  placeholder="contoh: facebook"
                  {...register}
                />
              </FormField>

              <FormField label="url" error={errors.url}>
                <Input
                  className="py-5"
                  placeholder="https://www.example.com"
                  {...register}
                />
              </FormField>

              <PasswordFormField
                label="password"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password123..."
                  className="py-5"
                />
              </PasswordFormField>

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
          <Button className="w-full cursor-pointer rounded-md xl:w-fit">
            Buat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

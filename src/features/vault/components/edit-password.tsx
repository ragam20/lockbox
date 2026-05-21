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
import type { VaultItemPassword } from "@/types/api";
import { useState } from "react";
import { z } from "zod";

const editPasswordSchema = z.object({
  title: z.string(),
  url: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;

      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, "Invalid URL"),
  password: z.string().optional(),
  description: z.string().optional(),
});

type EditPasswordValues = z.output<typeof editPasswordSchema>;

type EditPasswordProps = {
  open: boolean;
  item: VaultItemPassword | null;
  onOpenChange: (state: boolean) => void;
  onSubmit: (item: VaultItemPassword) => void;
};

export const EditPassword = ({
  open,
  item,
  onOpenChange,
  onSubmit,
}: EditPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <Heading5>Ubah Password</Heading5>
        </DialogHeader>

        <Form
          key={item.id}
          id="edit-login-id"
          className="my-4 flex flex-col"
          schema={editPasswordSchema}
          defaultValues={{
            title: item.title,
            url: item.url ?? "",
            password: item.password ?? "",
            description: item.description ?? "",
          }}
          onSubmit={(values: EditPasswordValues) => {
            onSubmit({
              ...item,
              title: values.title,
              url: values.url,
              password: values.password,
              description: values.description ?? "",
            });
            onOpenChange(false);
          }}
        >
          {({ register, errors }) => (
            <>
              <FormField label="judul" error={errors.title}>
                <Input
                  className="py-5"
                  placeholder="contoh: facebook"
                  {...register("title")}
                />
              </FormField>

              <FormField label="url" error={errors.url}>
                <Input
                  className="py-5"
                  placeholder="https://www.example.com"
                  {...register("url")}
                />
              </FormField>

              <PasswordFormField
                label="password"
                error={errors.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password123..."
                  className="py-5"
                  {...register("password")}
                />
              </PasswordFormField>

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
            form="edit-login-id"
            className="w-full cursor-pointer rounded-md xl:w-fit"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

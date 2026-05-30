import { Button, SubmitButton } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import type { User } from "@/types/entity";
import z from "zod";
import { SetAvatar } from "./set-avatar";

const editProfileSchema = z.object({
  name: z.string(),
  email: z.email(),
});

export const Profile = () => {
  const user: User = {
    id: "1",
    name: "Sylla Bear",
    email: "sylla@gmail.com",
    masterKeySalt: "",
    authVerifierSalt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const defaultValues = {
    name: user.name,
    email: user.email,
  };

  return (
    <div className="w-full">
      <SetAvatar user={user} />

      <div className="">
        <Form
          key={user.id}
          id="profile-form"
          schema={editProfileSchema}
          defaultValues={defaultValues}
          onSubmit={() => {}}
        >
          {({ register, errors, state, reset }) => (
            <>
              <FormField label="nama" error={errors.name}>
                <Input
                  className="py-5"
                  placeholder={user.name ?? ""}
                  {...register("name")}
                />
              </FormField>

              <FormField label="email" error={errors.email}>
                <Input
                  className="py-5"
                  placeholder={user.email ?? ""}
                  {...register("email")}
                />
              </FormField>

              {state.isDirty && (
                <div className="mt-8 flex justify-end gap-3">
                  <Button
                    type="button"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      reset(defaultValues);
                    }}
                  >
                    Batalkan
                  </Button>

                  <SubmitButton type="submit">Ubah</SubmitButton>
                </div>
              )}
            </>
          )}
        </Form>
      </div>
    </div>
  );
};

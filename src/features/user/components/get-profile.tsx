import { Button, SubmitButton } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { SetAvatar } from "./set-avatar";
import { useGetUserQuery } from "@/lib/auth";
import { useUpdateProfile } from "../api/update-profile";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

const editProfileSchema = z.object({
  name: z.string(),
});
type EditProfileSchema = z.infer<typeof editProfileSchema>;

export const Profile = () => {
  const userQuery = useGetUserQuery();

  const user = userQuery.data;

  const defaultValues = {
    name: user?.name,
  };

  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = async (data: EditProfileSchema) => {
    await updateProfileMutation.mutateAsync(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        toast.success("Berhasil update profile");
      },
    });
  };

  return (
    <div className="w-full">
      <SetAvatar user={user!} />

      <div>
        <Form
          key={user?.id}
          id="profile-form"
          schema={editProfileSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        >
          {({ register, errors, state, reset }) => (
            <>
              <FormField label="nama" error={errors.name}>
                <Input
                  className="py-5"
                  placeholder={user?.name ?? ""}
                  {...register("name")}
                />
              </FormField>

              <FormField label="email">
                <Input
                  disabled
                  className="py-5"
                  placeholder={user?.email ?? ""}
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

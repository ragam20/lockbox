import z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";

const editTuningArgon = z.object({
  memory: z.int(),
  time: z.int(),
  parallelism: z.int(),
});

type EditTuningArgonValues = z.output<typeof editTuningArgon>;

export const PasswordTuning = () => {
  return (
    <>
      <Form
        id="argon2id-tuning-form"
        onSubmit={(values: EditTuningArgonValues) => {}}
        schema={editTuningArgon}
      >
        {({ register, errors }) => (
          <>
            <FormField label="Memori" error={errors.memory}>
              <Input placeholder="3" className="py-4" {...register} />
            </FormField>

            <FormField label="Time" error={errors.time}>
              <Input placeholder="3" className="py-4" {...register} />
            </FormField>

            <FormField label="Paralel" error={errors.parallelism}>
              <Input placeholder="3" className="py-4" {...register} />
            </FormField>
          </>
        )}
      </Form>

      <Button className="rounded-md my-4 cursor-pointer">Simpan</Button>
    </>
  );
};

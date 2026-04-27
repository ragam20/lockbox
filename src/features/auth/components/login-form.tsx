import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, PasswordFormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BodyText, Heading3 } from "@/components/typography";

export const LoginForm = () => {};

const LoginCard = () => {
  return (
    <Card className="w-90 border border-forest  rounded-md h-70">
      <CardHeader>
        <CardTitle className="text-center">
          <Heading3 className="font-bold">Daftar</Heading3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Form id="register-form" schema={null} onSubmit={() => {}}>
          {({ register, errors }) => (
            <>
              <FormField label="email" error={errors.email}>
                <Input
                  type="email"
                  className="rounded-md"
                  {...register("email")}
                />
              </FormField>
            </>
          )}
        </Form>
        <Button className="w-full rounded-md cursor-pointer">Submit</Button>
        <BodyText className="text-white text-xs mt-4 text-center">
          Belum punya akun?{" "}
          <span className="text-neon-green cursor-pointer">Daftar</span>
        </BodyText>
      </CardContent>
    </Card>
  );
};

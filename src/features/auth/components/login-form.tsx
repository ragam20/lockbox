import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, PasswordFormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BodyText, Heading3 } from "@/components/typography";
import { useState } from "react";
import { z } from "zod";
import { Link } from "react-router";
import { paths } from "@/config/paths";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitForm = (data: LoginFormValues) => {};

  return (
    <Card className="w-90 border border-forest rounded-md ">
      <CardHeader>
        <CardTitle className="text-center">
          <Heading3 className="font-bold">Masuk</Heading3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Form id="register-form" schema={loginSchema} onSubmit={onSubmitForm}>
          {({ register, errors }) => (
            <>
              <FormField label="Email" error={errors.email}>
                <Input
                  type="email"
                  className="rounded-md"
                  {...register("email")}
                />
              </FormField>
              <PasswordFormField
                label="Password"
                error={errors.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="masukkan password"
                  className="rounded-md"
                  {...register("password")}
                />
              </PasswordFormField>
            </>
          )}
        </Form>
        <Button className="w-full rounded-md cursor-pointer">Submit</Button>
        <BodyText className="text-white text-xs mt-4 text-center">
          Belum punya akun?{" "}
          <Link to={paths.auth.register.path}>
            <span className="text-neon-green cursor-pointer">Daftar</span>
          </Link>
        </BodyText>
      </CardContent>
    </Card>
  );
};

import { type ZodType, type z } from "zod";
import {
  useForm,
  type FieldValues,
  type FormState,
  type SubmitHandler,
  type UseFormRegister,
  type UseFormWatch,
  type FieldErrors,
  FormProvider,
  type FieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { cloneElement, isValidElement, type ReactElement } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../label";
import { BodyText } from "@/components/typography";
import { EyeIcon } from "@phosphor-icons/react";

type FormProps<Schema extends ZodType<FieldValues, FieldValues>> = {
  schema: Schema;
  onSubmit: SubmitHandler<z.output<Schema>>;
  children: (props: {
    register: UseFormRegister<z.input<Schema>>;
    errors: FieldErrors<z.input<Schema>>;
    watch: UseFormWatch<z.input<Schema>>;
    state: FormState<z.input<Schema>>;
  }) => React.ReactNode;
  id?: string;
  className?: string;
};

export const Form = <Schema extends ZodType<FieldValues, FieldValues>>({
  schema,
  onSubmit,
  children,
  id,
  className,
}: FormProps<Schema>) => {
  const methods = useForm<z.input<Schema>, unknown, z.output<Schema>>({
    resolver: zodResolver(schema),
    criteriaMode: "all",
    mode: "onBlur",
  });

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        className={className}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children({
          register: methods.register,
          errors: methods.formState.errors,
          watch: methods.watch,
          state: methods.formState,
        })}
      </form>
    </FormProvider>
  );
};

type FormFieldChild = ReactElement<{
  className?: string;
  "aria-invalid"?: "true" | "false";
}>;

type FormFieldProps = {
  label: string;
  error?: FieldError;
  children: FormFieldChild | React.ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  const child = isValidElement<{ className?: string; "aria-invalid"?: string }>(
    children,
  )
    ? cloneElement(children as FormFieldChild, {
        "aria-invalid": error ? "true" : "false",
        className: cn(
          (children as FormFieldChild).props.className,
          error && "border-red-500 focus-visible:ring-red-200",
        ),
      })
    : children;

  return (
    <div className="my-4">
      <Label className="block text-md font-medium my-2">{label}</Label>
      {child}
      {error?.message && (
        <BodyText className="text-red-600 mt-1">{error.message}</BodyText>
      )}
    </div>
  );
}

type PasswordFormFieldProps = {
  label: string;
  error?: FieldError;
  children: FormFieldChild | React.ReactNode;
  showPassword: boolean;
  setShowPassword: (state: boolean) => void;
};

export function PasswordFormField({
  label,
  error,
  children,
  showPassword,
  setShowPassword,
}: PasswordFormFieldProps) {
  const child = isValidElement<{ className?: string; "aria-invalid"?: string }>(
    children,
  )
    ? cloneElement(children as FormFieldChild, {
        "aria-invalid": error ? "true" : "false",
        className: cn(
          (children as FormFieldChild).props.className,
          error && "border-red-500 focus-visible:ring-red-200",
        ),
      })
    : children;

  return (
    <div className="my-4">
      <div className="flex w-full items-center justify-between">
        <Label className="block text-md font-medium my-2">{label}</Label>
        <div
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          className="flex gap-1 cursor-pointer"
        >
          {!showPassword ? (
            <EyeIcon className="size-5" />
          ) : (
            <EyeIcon className="size-5" />
          )}

          <BodyText>show</BodyText>
        </div>
      </div>
      {child}
    </div>
  );
}

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const isDisabled = disabled || loading;
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "cursor-wait",
      )}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </Comp>
  );
}

function SubmitButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const isDisabled = disabled || loading;

  if (asChild) {
    console.log("count:", React.Children.count(children));
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "cursor-wait",
      )}
      disabled={isDisabled}
      {...props}
    >
      {!asChild && loading ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : null}

      {children}
    </Comp>
  );
}

export { Button, SubmitButton };

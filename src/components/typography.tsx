import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean
}

function createTypographyComponent(
  element: React.ElementType,
  slot: string,
  className: string
) {
  function TypographyComponent({
    asChild = false,
    className: customClassName,
    ...props
  }: TypographyProps) {
    const Comp: React.ElementType = asChild ? Slot.Root : element

    return (
      <Comp
        data-slot={slot}
        className={cn(className, customClassName)}
        {...props}
      />
    )
  }

  return TypographyComponent
}

const DisplayXL = createTypographyComponent(
  "h1",
  "typography-display-xl",
  "type-display-xl text-foreground"
)

const Heading1 = createTypographyComponent(
  "h1",
  "typography-heading-1",
  "type-heading-1 text-foreground"
)

const Heading2 = createTypographyComponent(
  "h2",
  "typography-heading-2",
  "type-heading-2 text-foreground"
)

const Heading3 = createTypographyComponent(
  "h3",
  "typography-heading-3",
  "type-heading-3 text-foreground"
)

const Heading4 = createTypographyComponent(
  "h4",
  "typography-heading-4",
  "type-heading-4 text-foreground"
)

const Heading5 = createTypographyComponent(
  "h5",
  "typography-heading-5",
  "type-heading-5 text-foreground"
)

const BodyLarge = createTypographyComponent(
  "p",
  "typography-body-large",
  "type-body-large text-foreground"
)

const BodyText = createTypographyComponent(
  "p",
  "typography-body",
  "type-body text-foreground"
)

const BodyMedium = createTypographyComponent(
  "p",
  "typography-body-medium",
  "type-body-medium text-foreground"
)

const CaptionText = createTypographyComponent(
  "p",
  "typography-caption",
  "type-caption text-muted-foreground"
)

const OverlineText = createTypographyComponent(
  "p",
  "typography-overline",
  "type-overline text-neon-green"
)

export {
  DisplayXL,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  BodyLarge,
  BodyText,
  BodyMedium,
  CaptionText,
  OverlineText,
}

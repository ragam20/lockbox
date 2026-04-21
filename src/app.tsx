import {
  BodyLarge,
  BodyMedium,
  CaptionText,
  DisplayXL,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  OverlineText,
} from "@/components/typography";

function App() {
  return (
    <main className="min-h-svh bg-background px-5 py-8 text-foreground sm:px-8 lg:px-12">
      <section className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-5">
          <OverlineText>Lockbox typography</OverlineText>
          <DisplayXL className="max-w-5xl text-balance">
            Secure system language
          </DisplayXL>
          <BodyLarge className="max-w-3xl text-pistachio">
            The scale, weights, line heights, and tracking are available as
            named components and `type-*` CSS classes.
          </BodyLarge>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="border border-card-border bg-deep-teal p-5">
            <div className="space-y-4">
              <Heading1>Heading 1</Heading1>
              <Heading2>Heading 2</Heading2>
              <Heading3>Heading 3</Heading3>
              <Heading4>Heading 4</Heading4>
              <Heading5>Heading 5</Heading5>
              <BodyMedium className="text-pistachio">
                Body Medium pairs the body size with a stronger 550 weight.
              </BodyMedium>
              <CaptionText>Caption text uses 14px at 500 weight.</CaptionText>
            </div>
          </div>

          <div className="border border-card-border bg-dark-forest p-5">
            <OverlineText>Palette</OverlineText>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="h-16 border border-card-border bg-white" />
              <div className="h-16 border border-card-border bg-neon-green" />
              <div className="h-16 border border-card-border bg-aloe" />
              <div className="h-16 border border-card-border bg-pistachio" />
              <div className="h-16 border border-card-border bg-forest" />
              <div className="h-16 border border-card-border bg-deep-teal" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;

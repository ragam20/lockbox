import { ContentLayout } from "@/components/layouts/content-layout";
import { Head } from "@/components/seo/head";
import { BodyText } from "@/components/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TuningArgon } from "./tab/tuning-argon";
import { GeneratePassword } from "./tab/generate-password";

export const ToolRoute = () => {
  return (
    <ContentLayout>
      <Head title="Peralatan" description="tools" />
      <ToolTab />
    </ContentLayout>
  );
};

type ToolSection = {
  value: string;
  title: string;
  section: React.ReactNode;
};

const toolsSections: ToolSection[] = [
  {
    value: "algo-tuning",
    title: "Pengaturan Algoritma",
    section: <TuningArgon />,
  },
  {
    value: "generate-password",
    title: "Password Acak",
    section: <GeneratePassword />,
  },
];

const ToolTab = () => {
  return (
    <Tabs
      defaultValue={toolsSections[0].value}
      className="w-full mt-4"
      orientation="horizontal"
    >
      <TabsList className="h-auto w-fit items-stretch justify-start gap-2">
        {toolsSections.map((section) => {
          return (
            <TabsTrigger
              key={section.value}
              value={section.value}
              className="h-10 flex-1 cursor-pointer px-3 py-2 data-[state=active]:bg-forest data-[state=active]:text-foreground rounded-md"
            >
              <BodyText className="text-sm">{section.title}</BodyText>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {toolsSections.map((item) => (
        <TabsContent key={item.value} value={item.value} className="mt-6">
          {item.section}
        </TabsContent>
      ))}
    </Tabs>
  );
};

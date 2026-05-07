import { ContentLayout } from "@/components/layouts/content-layout";
import { Head } from "@/components/seo/head";

export const ArchiveRoute = () => {
  return (
    <ContentLayout>
      <Head title="Arsip" description="Archive" />
      <div>Archive</div>
    </ContentLayout>
  );
};

import { ContentLayout } from "@/components/layouts/content-layout";
import { Head } from "@/components/seo/head";
import { ArchiveList } from "@/features/vault/components/archive-list";

export const ArchiveRoute = () => {
  return (
    <ContentLayout>
      <Head title="Arsip" description="Archive" />
      <ArchiveList />
    </ContentLayout>
  );
};

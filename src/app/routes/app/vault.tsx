import { ContentLayout } from "@/components/layouts/content-layout";
import { Head } from "@/components/seo/head";

export const VaultRoute = () => {
  return (
    <ContentLayout>
      <Head title="Brangkas" description="vault page" />
      <div className="w-full">Vault</div>
    </ContentLayout>
  );
};

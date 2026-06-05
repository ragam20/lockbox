import { ContentLayout } from "@/components/layouts/content-layout";
import { Head } from "@/components/seo/head";
import { Profile } from "@/features/user/components/get-profile";

export const AccountSettingRoute = () => {
  return (
    <ContentLayout>
      <Head title="Akun" description="pengaturan akun" />
      <div className="px-4 md:px-0 w-90 sm:w-140 flex items-center m-auto min-h-150 my-4">
        <Profile />
      </div>
    </ContentLayout>
  );
};

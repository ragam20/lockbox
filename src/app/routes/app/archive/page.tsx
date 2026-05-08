import { ContentLayout } from "@/components/layouts/content-layout";
import { Head } from "@/components/seo/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VaultFilter } from "@/components/ui/popover/vault-filter";
import { ArchiveList } from "@/features/archive/components/archive-list";
import { ListFilterIcon } from "lucide-react";
import type { FormEvent } from "react";

export const ArchiveRoute = () => {
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <ContentLayout>
      <Head title="Arsip" description="Archive" />
      <div className="min-w-0 overflow-x-hidden p-4 md:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <VaultFilter value={() => {}}>
            <ListFilterIcon className="size-5 shrink-0 cursor-pointer" />
          </VaultFilter>
          <form onSubmit={handleSearch} className="flex min-w-0 flex-1 gap-4">
            <Input placeholder="cari arsip ..." className="rounded-md py-4.5" />
            <Button
              type="submit"
              className="cursor-pointer rounded-md px-6 py-4"
            >
              Cari
            </Button>
          </form>
        </div>

        <div className="mt-15">
          <ArchiveList />
        </div>
      </div>
    </ContentLayout>
  );
};

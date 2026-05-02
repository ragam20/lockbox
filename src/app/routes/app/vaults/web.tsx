import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VaultFilter } from "@/components/ui/popover/vault-filter";
import { WebVaultList } from "@/features/vault/components/web-vault-list";
import type { FormEvent } from "react";
import { ListFilterIcon } from "lucide-react";

export const WebSection = () => {
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="flex gap-4 items-center">
        <VaultFilter value={() => {}}>
          <ListFilterIcon className="size-5 cursor-pointer" />
        </VaultFilter>
        <form onSubmit={handleSearch} className="flex w-full gap-4">
          <Input placeholder="cari web ..." className="py-4.5 rounded-md" />
          <Button
            type="submit"
            className="py-4 px-6 rounded-md cursor-pointer"
          >
            Cari
          </Button>
        </form>
      </div>

      <div className="mt-15">
        <WebVaultList />
      </div>
    </div>
  );
};

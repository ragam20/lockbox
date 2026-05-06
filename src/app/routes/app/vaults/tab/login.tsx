import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VaultFilter } from "@/components/ui/popover/vault-filter";
import { LoginList } from "@/features/vault/components/login-list";
import type { FormEvent } from "react";
import { ListFilterIcon } from "lucide-react";

export const LoginSection = () => {
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-w-0 overflow-x-hidden">
      <div className="flex min-w-0 items-center gap-4">
        <VaultFilter value={() => {}}>
          <ListFilterIcon className="size-5 shrink-0 cursor-pointer" />
        </VaultFilter>
        <form onSubmit={handleSearch} className="flex min-w-0 flex-1 gap-4">
          <Input placeholder="cari login ..." className="py-4.5 rounded-md" />
          <Button type="submit" className="py-4 px-6 rounded-md cursor-pointer">
            Cari
          </Button>
        </form>
      </div>

      <div className="mt-15">
        <LoginList />
      </div>
    </div>
  );
};

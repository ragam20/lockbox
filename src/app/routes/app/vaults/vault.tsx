import { ContentLayout } from "@/components/layouts/content-layout";
import { Head } from "@/components/seo/head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyText } from "@/components/typography";
import { CreatePassword } from "@/features/vault/components/create-password";
import {
  GlobeLockIcon,
  NotebookTextIcon,
  PlusIcon,
  StarIcon,
  type LucideIcon,
} from "lucide-react";
import { FavoriteSection } from "./tab/favorites";
import { PasswordSection } from "./tab/password";
import { NotesSection } from "./tab/notes";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { CreateNote } from "@/features/vault/components/create-note";

type VaultSection = {
  value: string;
  title: string;
  description: string;
  emptyState: string;
  icon: LucideIcon;
  iconClassName: string;
  section: React.ReactNode;
};

const vaultSections: VaultSection[] = [
  {
    value: "web",
    title: "Password",
    description: "Simpan kredensial website dan akun online dengan rapi.",
    emptyState: "Belum ada login website yang tersimpan.",
    icon: GlobeLockIcon,
    iconClassName: "text-blue-500",
    section: <PasswordSection />,
  },
  {
    value: "catatan",
    title: "Catatan",
    description: "Tempat aman untuk PIN, recovery code, dan catatan sensitif.",
    emptyState: "Belum ada catatan aman yang dibuat.",
    icon: NotebookTextIcon,
    iconClassName: "text-amber-900",
    section: <NotesSection />,
  },
  {
    value: "favorite",
    title: "Favorite",
    description: "Kumpulan item yang paling sering kamu akses.",
    emptyState: "Belum ada item favorit di vault kamu.",
    icon: StarIcon,
    iconClassName: "text-yellow-300",
    section: <FavoriteSection />,
  },
];

export const VaultRoute = () => {
  return (
    <ContentLayout>
      <Head title="Brangkas" description="vault page" />
      <VaultTabs />
    </ContentLayout>
  );
};

const VaultTabs = () => {
  const [isCreateLoginOpen, setIsCreateLoginOpen] = useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full touch-pan-y overflow-x-clip overscroll-x-none bg-void">
      <CreatePassword
        open={isCreateLoginOpen}
        onOpenChange={setIsCreateLoginOpen}
      />

      <CreateNote open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen} />

      <Tabs
        defaultValue={vaultSections[0].value}
        orientation="vertical"
        className="min-h-[calc(100svh-4rem)] w-full min-w-0 flex-col md:flex-row md:gap-0"
      >
        <TabsList
          variant="line"
          className="h-auto w-full shrink-0 items-stretch gap-2 bg-void p-4 md:w-56 "
        >
          {vaultSections.map((item) => {
            const Icon = item.icon;

            return (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="justify-start gap-3 rounded-xs px-3 py-2 text-sm data-[state=active]:bg-forest data-[state=active]:font-semibold data-[state=active]:text-foreground cursor-pointer "
              >
                <Icon className={`size-4 ${item.iconClassName}`} />
                <BodyText className="text-sm">{item.title}</BodyText>
              </TabsTrigger>
            );
          })}

          <AddNewVaultItemPopover
            onCreateLogin={() => setIsCreateLoginOpen(true)}
            onCreateNote={() => setIsCreateNoteOpen(true)}
          >
            <Button className="my-4 hover:bg-neon-green rounded-md gap-1  cursor-pointer font-bold text-sm">
              <PlusIcon className="size-5 mb-0.5" />
              Tambah
            </Button>
          </AddNewVaultItemPopover>
        </TabsList>

        {vaultSections.map((item) => {
          return (
            <TabsContent
              key={item.value}
              value={item.value}
              className="min-w-0 flex-1 overflow-x-hidden bg-deep-teal p-4 md:p-6"
            >
              {item.section}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

type AddNewVaultAction = "create-password" | "create-note";

type AddNewVaultItem = {
  title: string;
  icon: LucideIcon;
  iconClassName: string;
  action?: AddNewVaultAction;
};

const addNewVaultItem: AddNewVaultItem[] = [
  {
    title: "Masuk",
    icon: GlobeLockIcon,
    iconClassName: "text-blue-500 size-3",
    action: "create-password",
  },
  {
    title: "Catatan",
    icon: NotebookTextIcon,
    iconClassName: "text-amber-900 size-3",
    action: "create-note",
  },
];

type AddNewVaultItemPopoverProps = {
  onCreateLogin: () => void;
  onCreateNote: () => void;
  children: React.ReactNode;
};

const AddNewVaultItemPopover = ({
  onCreateLogin,
  onCreateNote,
  children,
}: AddNewVaultItemPopoverProps) => {
  const actionHandlers: Partial<Record<AddNewVaultAction, () => void>> = {
    "create-password": onCreateLogin,
    "create-note": onCreateNote,
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-full">
        {addNewVaultItem.map((item) => (
          <div
            key={item.title}
            className="flex gap-2 items-center cursor-pointer hover:bg-forest"
            onClick={item.action ? actionHandlers[item.action] : undefined}
          >
            <item.icon className={item.iconClassName} />
            <BodyText className="text-sm">{item.title}</BodyText>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

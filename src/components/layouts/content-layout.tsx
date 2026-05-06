import type React from "react";
import { Button } from "../ui/button";

export const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh w-full min-w-0 max-w-full flex-col overflow-x-clip">
      <header className="flex h-16 w-full min-w-0 justify-end gap-4 border-b p-4">
        <Button className="rounded-xs cursor-pointer">Upgrade</Button>
      </header>
      <main className="w-full min-w-0 flex-1 overflow-x-clip bg-deep-teal">
        {children}
      </main>
    </div>
  );
};

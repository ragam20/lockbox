import type React from "react";
import { Button } from "../ui/button";

export const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="h-16 w-full border-b p-4 flex justify-end">
        <Button className="rounded-xs cursor-pointer">Upgrade</Button>
      </header>
      <main className="w-full flex-1 bg-deep-teal">{children}</main>
    </div>
  );
};

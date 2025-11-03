import { ComponentsList } from "@/components/components/components-list";
import { ComponentsPageHeader } from "@/components/components/components-page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutshell | My Components",
  description: "...",
};

export default function ComponentsPage() {
  return (
    <>
      <div className="flex min-h-svh flex-col">
        <ComponentsPageHeader />
        <main className="flex flex-1 flex-col">
          <div className="mx-auto my-4 flex h-full w-full max-w-[332px] flex-1 flex-col gap-4 px-4 md:max-w-[648px] lg:max-w-[964px] xl:max-w-[1280px]">
            <ComponentsList />
          </div>
        </main>
      </div>
    </>
  );
}

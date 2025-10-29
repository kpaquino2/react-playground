import { AuthStateButton } from "@/components/auth/auth-state-button";
import { ComponentsList } from "@/components/components/components-list";

export default function ComponentsPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="h-12 border-b">
        <div className="mx-auto flex h-full max-w-[332px] items-center justify-between px-4 md:max-w-[648px] lg:max-w-[964px] xl:max-w-[1280px]">
          <p>React Playground</p>
          <AuthStateButton />
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto flex max-w-[332px] flex-col px-4 md:max-w-[648px] lg:max-w-[964px] xl:max-w-[1280px]">
          <ComponentsList />
        </div>
      </main>
    </div>
  );
}

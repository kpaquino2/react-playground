import { AuthStateButton } from "@/components/auth/auth-state-button";
import { ComponentsList } from "@/components/components/components-list";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function ComponentsPage() {
  return (
    <>
      <div className="flex min-h-svh flex-col">
        <header className="h-12 border-b">
          <div className="mx-auto flex h-full max-w-[332px] items-center justify-between px-4 md:max-w-[648px] lg:max-w-[964px] xl:max-w-[1280px]">
            <Button variant="ghost" size="icon-lg" asChild className="group">
              <Link href="/">
                <Logo className="size-6" />
              </Link>
            </Button>
            <AuthStateButton />
          </div>
        </header>
        <main className="flex flex-1 flex-col">
          <div className="mx-auto my-4 flex h-full w-full max-w-[332px] flex-1 flex-col gap-4 px-4 md:max-w-[648px] lg:max-w-[964px] xl:max-w-[1280px]">
            <ComponentsList />
          </div>
        </main>
      </div>
    </>
  );
}

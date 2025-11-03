"use client";

import { useRouter } from "next/navigation";
import { AuthStateButton } from "../auth/auth-state-button";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import Link from "next/link";

export function ComponentsPageHeader() {
  const router = useRouter();
  return (
    <header className="h-12 border-b">
      <div className="mx-auto flex h-full max-w-[332px] items-center justify-between px-4 md:max-w-[648px] lg:max-w-[964px] xl:max-w-[1280px]">
        <Button variant="ghost" size="icon-lg" asChild className="group">
          <Link href="/">
            <Logo className="size-6" />
          </Link>
        </Button>
        <AuthStateButton onSignOut={() => router.push("/")} />
      </div>
    </header>
  );
}

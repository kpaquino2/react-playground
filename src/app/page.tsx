import { AuthStateButton } from "@/components/auth/auth-state-button";
import { StartButton } from "@/components/auth/start-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nutshell",
  description:
    "A component-centric React playground. Create, share, and import React components with zero setup. Tailwind CSS and full React support included.",
};

export default async function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header className="px-4 py-5 sm:px-8 md:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Button variant="ghost" size="xl" asChild className="group">
            <Link href="/">
              <Logo className="size-7" />
              <p className="text-2xl font-bold">Nutshell</p>
            </Link>
          </Button>
          <AuthStateButton />
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="mb-6 text-4xl leading-tight font-extrabold sm:text-5xl md:text-6xl">
          Build & Test React Components.
          <br className="" />
          All in a <span className="text-teal-400">Nutshell</span>.
        </h1>
        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg md:text-xl">
          A component-centric React playground for building, sharing, and
          remixing components instantly. No setup, no build process. Just code.
        </p>
        <div className="flex gap-4">
          <StartButton />
          <Button asChild variant="outline" size="xl">
            <Link
              href="https://github.com/kpaquino2/react-playground"
              className="text-xl font-semibold"
            >
              View on GitHub
            </Link>
          </Button>
        </div>
      </main>
      <footer className="py-8 text-center">
        <p className="text-muted-foreground text-sm">
          Built by{" "}
          <Link
            href="https://github.com/kpaquino2"
            className="text-gray-400 underline hover:text-teal-400"
          >
            Kyle Aquino
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}

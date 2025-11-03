import { AuthStateButton } from "@/components/auth/auth-state-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex h-screen flex-col">
      <header className="px-4 py-5 sm:px-8 md:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Button variant="ghost" size="xl" asChild className="group">
            <Link href="/">
              <Logo className="size-6" />
              <p className="text-2xl font-bold">Nutshell</p>
            </Link>
          </Button>
          <AuthStateButton />
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="mb-6 text-4xl leading-tight font-extrabold text-white sm:text-5xl md:text-6xl">
          Build & Test React Components.
          <br className="" />
          All in a <span className="text-teal-400">Nutshell</span>.
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
          A lightweight in-browser sandbox for creating and testing React
          components. No setup, no build process. Just code.
        </p>
        <div className="flex gap-4">
          <Button asChild size="xl">
            <Link
              href={user ? "/components" : "/c/trial-component"}
              className="text-xl font-semibold"
            >
              {user ? "Start Building Now" : "Try It Out"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href="/" className="text-xl font-semibold">
              View on GitHub
            </Link>
          </Button>
        </div>
      </main>
      <footer className="py-8 text-center">
        <p className="text-sm text-gray-500">
          Built by{" "}
          <Link
            href="https://github.com/kpaquino2"
            className="text-gray-400 underline hover:text-indigo-400"
          >
            Kyle Aquino
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}

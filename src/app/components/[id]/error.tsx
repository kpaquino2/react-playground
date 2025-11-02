"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex h-screen max-w-lg items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">{error.name || "Error"}</h1>
        <p className="text-xl">
          {error.message ||
            "Oops, something went wrong. Please try again later"}
        </p>
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild variant="link">
          <Link href="/components"> ← Back to Components</Link>
        </Button>
      </div>
    </div>
  );
}

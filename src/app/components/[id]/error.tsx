"use client";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex h-screen max-w-lg items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{error.name || "Error"}</h1>
        <p className="mb-4 text-xl">
          {error.message ||
            "Oops, something went wrong. Please try again later"}
        </p>
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}

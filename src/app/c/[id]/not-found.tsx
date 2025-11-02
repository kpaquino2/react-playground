import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl">Component not found</p>
        <Button asChild variant="link">
          <Link href="/components"> ← Back to Components</Link>
        </Button>
      </div>
    </div>
  );
}

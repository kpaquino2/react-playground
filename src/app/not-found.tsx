import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl">Page not found</p>
        <Button asChild variant="link">
          <Link href="/"> ← Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

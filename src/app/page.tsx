import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid h-screen w-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Welcome to React Playground</h1>
        <p>Edit and play with your own React components!</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/components">Start</Link>
          </Button>
          <Button asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

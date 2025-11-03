"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/context/auth-context";

export function StartButton() {
  const { user } = useAuth();

  return (
    <Button asChild size="xl">
      <Link
        href={user ? "/components" : "/c/trial-component"}
        className="text-xl font-semibold"
      >
        {user ? "Start Building Now" : "Try It Out"}
      </Link>
    </Button>
  );
}

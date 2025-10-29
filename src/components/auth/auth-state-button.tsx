"use client";

import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import { Button } from "../ui/button";

export function AuthStateButton() {
  const { user, signOut } = useAuth();
  return user ? (
    <Button size="sm" onClick={signOut}>
      Sign out
    </Button>
  ) : (
    <Button asChild size="sm">
      <Link href="/signin">Sign in</Link>
    </Button>
  );
}

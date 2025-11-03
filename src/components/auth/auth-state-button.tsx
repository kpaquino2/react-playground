"use client";

import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserMenu } from "./user-menu";
import { Spinner } from "../ui/spinner";

export function AuthStateButton() {
  const { user, loading } = useAuth();
  return user ? (
    <UserMenu />
  ) : (
    <Button asChild={!!user} variant="ghost">
      {loading ? <Spinner /> : <Link href="/signin">Sign in</Link>}
    </Button>
  );
}

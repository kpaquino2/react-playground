"use client";

import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserMenu } from "./user-menu";
import { Spinner } from "../ui/spinner";

export function AuthStateButton({ onSignOut }: { onSignOut?: () => void }) {
  const { user, loading } = useAuth();
  return user ? (
    <UserMenu onSignOut={onSignOut} />
  ) : (
    <Button asChild={!!user} variant="secondary">
      {loading ? <Spinner /> : <Link href="/signin">Sign in</Link>}
    </Button>
  );
}

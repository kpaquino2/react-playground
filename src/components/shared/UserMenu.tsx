"use client";

import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  return user ? (
    <button
      onClick={signOut}
      className="cursor-pointer rounded bg-teal-600 px-2 py-1 transition-colors hover:bg-teal-700"
    >
      Sign out
    </button>
  ) : (
    <Link
      href="/signin"
      className="cursor-pointer rounded bg-teal-600 px-2 py-1 transition-colors hover:bg-teal-700"
    >
      Sign in
    </Link>
  );
};

export default UserMenu;

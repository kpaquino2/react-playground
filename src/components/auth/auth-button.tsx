"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { RiGithubFill } from "@remixicon/react";
import { Provider } from "@supabase/supabase-js";
import { Button } from "../ui/button";

interface AuthButtonProps {
  provider: Provider;
}

export function AuthButton({ provider }: AuthButtonProps) {
  const { signInWithGithub } = useAuth();

  const providerMap: Partial<
    Record<
      Provider,
      {
        icon: React.ReactNode;
        name: string;
        onClick: () => Promise<void>;
      }
    >
  > = {
    github: {
      icon: <RiGithubFill className="size-5" />,
      name: "GitHub",
      onClick: signInWithGithub,
    },
  };

  return (
    <Button onClick={providerMap[provider]?.onClick} size="lg">
      {providerMap[provider]?.icon}
      <p className="">Sign in with {providerMap[provider]?.name}</p>
    </Button>
  );
}

"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { RiGithubFill, RiGoogleFill } from "@remixicon/react";
import { Provider } from "@supabase/supabase-js";

interface AuthButtonProps {
  provider: Provider;
}

const AuthButton = ({ provider }: AuthButtonProps) => {
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
      icon: <RiGithubFill />,
      name: "GitHub",
      onClick: signInWithGithub,
    },
  };

  return (
    <button
      onClick={providerMap[provider]?.onClick}
      className="flex cursor-pointer items-center justify-center gap-2 rounded bg-teal-600 px-5 py-2 transition-colors hover:bg-teal-700"
    >
      {providerMap[provider]?.icon}
      <p className="text-lg">Sign in with {providerMap[provider]?.name}</p>
    </button>
  );
};

export default AuthButton;

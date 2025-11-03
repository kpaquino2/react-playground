import {
  ArrowLeftIcon,
  LockKeyholeIcon,
  PlayIcon,
  SaveIcon,
  SquarePenIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { SharePopover } from "./share-popover";
import type { Component } from "@/lib/types";
import { Kbd } from "../ui/kbd";
import { isMac } from "@/lib/utils";
import { AuthStateButton } from "../auth/auth-state-button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";

interface ComponentEditorHeaderProps {
  run: () => void;
  isRunning: boolean;
  isSaving: boolean;
  readOnly: boolean;
  trialMode: boolean;
  setOpenUpdateComponentDialog: (c: Component) => void;
}

export function ComponentEditorHeader({
  run,
  isRunning,
  isSaving,
  readOnly,
  trialMode,
  setOpenUpdateComponentDialog,
  ...rest
}: ComponentEditorHeaderProps & Component) {
  const component = rest;
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="max-w-screen overflow-hidden">
      <div className="h-15 border-b sm:h-12">
        <div className="mx-auto flex h-full items-center justify-between px-2">
          <div className="flex h-3/5 items-center gap-1.5 sm:gap-2">
            <Button className="size-6 sm:size-8" variant="ghost" asChild>
              <Link href="/components">
                <ArrowLeftIcon className="size-4 sm:size-5" />
              </Link>
            </Button>
            <Separator orientation="vertical" />
            <div className="ml-2 flex flex-col sm:flex-row sm:gap-2">
              <p className="text-sm">{component.name}</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {component.slug}
              </p>
            </div>
            {component.visibility === "private" && (
              <LockKeyholeIcon className="text-muted-foreground size-4" />
            )}
            {!trialMode && !readOnly && (
              <Button
                className="size-6 sm:size-8"
                variant="ghost"
                onClick={() => setOpenUpdateComponentDialog(component)}
              >
                <SquarePenIcon className="size-4 sm:size-5" />
              </Button>
            )}
            {isSaving && <SaveIcon className="text-muted-foreground size-4" />}
          </div>
          <div className="flex h-full items-center gap-2">
            <SharePopover
              id={component.id}
              name={component.name}
              slug={component.slug}
              visibility={component.visibility || "public"}
              disabled={readOnly || trialMode}
            />
            <Button
              variant="outline"
              onClick={run}
              disabled={isRunning}
              className="h-7 w-7 sm:h-8 sm:w-auto sm:px-3"
            >
              <PlayIcon />
              <p className="hidden sm:flex"> Run</p>
              <Kbd className="hidden sm:flex">{isMac() ? "⌘" : "Ctrl"}</Kbd>
              <Kbd className="hidden sm:flex">S</Kbd>
            </Button>
            <AuthStateButton
              onSignOut={() => {
                if (component.visibility === "private") router.push("/");
              }}
            />
          </div>
        </div>
      </div>
      {readOnly && (
        <div className="bg-secondary text-secondary-foreground flex justify-center border-b">
          This component is in read-only mode. You do not have access to make
          changes to the code.
        </div>
      )}
      {trialMode && (
        <div className="bg-secondary text-secondary-foreground w-full justify-center border-b px-2 text-center">
          <div className="inline">
            This component is for trial only.
            <Link
              href={user ? "/components" : "/signin"}
              className="inline pl-1 underline"
            >
              {user
                ? "Click here to start creating your own components"
                : "Sign in to start creating your own components."}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

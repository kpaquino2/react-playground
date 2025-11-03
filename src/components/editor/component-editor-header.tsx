import {
  ArrowLeftIcon,
  LockKeyholeIcon,
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
  const router = useRouter();

  return (
    <>
      <header>
        <div className="h-12 border-b">
          <div className="mx-auto flex h-full items-center justify-between px-2">
            <div className="flex h-3/5 items-center gap-2">
              <Button size="icon-sm" variant="ghost" asChild>
                <Link href="/components">
                  <ArrowLeftIcon className="size-5" />
                </Link>
              </Button>
              <Separator orientation="vertical" />
              <p className="ml-2">{component.name}</p>
              <p className="text-muted-foreground text-sm">{component.slug}</p>
              {component.visibility === "private" && (
                <LockKeyholeIcon className="text-muted-foreground size-4" />
              )}
              {!trialMode && !readOnly && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setOpenUpdateComponentDialog(component)}
                >
                  <SquarePenIcon className="" />
                </Button>
              )}
              {!isSaving && (
                <SaveIcon className="text-muted-foreground size-4" />
              )}
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
                size="sm"
                variant="outline"
                onClick={run}
                disabled={isRunning}
              >
                Run
                <Kbd>{isMac() ? "⌘" : "Ctrl"}</Kbd>
                <Kbd>S</Kbd>
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
          <div className="bg-secondary text-secondary-foreground flex justify-center border-b">
            You&apos;re in trial mode. Sign in to start creating your own
            components.
          </div>
        )}
      </header>
    </>
  );
}

import { ArrowLeftIcon, LockKeyholeIcon, SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { SharePopover } from "./share-popover";
import type { Component } from "@/lib/types";

interface ComponentEditorHeaderProps {
  run: () => void;
  isRunning: boolean;
  isSaving: boolean;
  readOnly: boolean;
}

export function ComponentEditorHeader({
  id,
  name,
  slug,
  visibility,
  run,
  isRunning,
  isSaving,
  readOnly,
}: ComponentEditorHeaderProps & Component) {
  return (
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
            <p className="ml-2">{name}</p>
            {visibility === "private" && (
              <LockKeyholeIcon className="text-muted-foreground size-4" />
            )}
            {isSaving && <SaveIcon />}
          </div>
          <div className="flex h-full items-center gap-2">
            <SharePopover
              id={id}
              name={name}
              slug={slug}
              visibility={visibility || "public"}
              disabled={readOnly}
            />
            <Button size="sm" onClick={run} disabled={isRunning}>
              Run
            </Button>
          </div>
        </div>
      </div>
      {readOnly && (
        <div className="bg-secondary text-secondary-foreground flex justify-center border-b">
          This component is in read-only mode. You do not have access to make
          changes to the code.
        </div>
      )}
    </header>
  );
}

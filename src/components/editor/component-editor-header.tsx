import {
  ArrowLeftIcon,
  GlobeIcon,
  LockKeyholeIcon,
  SaveIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";

interface ComponentEditorHeaderProps {
  name: string;
  visibility: "public" | "private" | null;
  run: () => void;
  isRunning: boolean;
  isSaving: boolean;
}

export function ComponentEditorHeader({
  name,
  visibility,
  run,
  isRunning,
  isSaving,
}: ComponentEditorHeaderProps) {
  return (
    <header className="h-12 border-b">
      <div className="mx-auto flex h-full items-center justify-between px-2">
        <div className="flex h-3/5 items-center gap-2">
          <Button size="icon-sm" variant="ghost" asChild>
            <Link href="/components">
              <ArrowLeftIcon className="size-5" />
            </Link>
          </Button>
          <Separator orientation="vertical" />
          <p className="ml-2">{name}</p>
          {visibility === "private" ? (
            <LockKeyholeIcon className="text-muted-foreground size-4" />
          ) : (
            <GlobeIcon className="text-muted-foreground size-4" />
          )}
          {isSaving && <SaveIcon />}
        </div>
        <div className="flex h-full items-center">
          <Button size="sm" onClick={run} disabled={isRunning}>
            Run
          </Button>
        </div>
      </div>
    </header>
  );
}

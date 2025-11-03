import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { CheckIcon, ChevronDownIcon, CopyIcon, Share2Icon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { Checkbox } from "../ui/checkbox";
import { getURL } from "@/lib/utils";

interface SharePopoverProps {
  visibility: "public" | "private";
  name: string;
  id: string;
  slug: string;
  disabled: boolean;
}

export function SharePopover({
  visibility,
  name,
  id,
  slug,
  disabled,
}: SharePopoverProps) {
  const { user } = useAuth();
  const [copiedText, copy] = useCopyToClipboard();
  const [useSlug, setUseSlug] = useState(true);
  const importText =
    `import ${name.replaceAll(" ", "")} from "/` +
    (useSlug ? `@${user?.user_metadata.user_name}/${slug}";` : `${id}";`);
  const linkText =
    getURL() +
    (useSlug ? `@${user?.user_metadata.user_name}/${slug}` : `c/${id}`);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="h-7 w-7 sm:h-8 sm:w-auto sm:px-3"
        >
          <Share2Icon />
          <p className="hidden sm:flex">Share</p>
          <ChevronDownIcon className="hidden sm:flex" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 sm:w-100"
        align="end"
        collisionPadding={16}
      >
        <div className="grid gap-2 sm:gap-4">
          <div className="space-y-2">
            <h4 className="text-sm leading-none font-medium sm:text-base">
              {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
            </h4>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {visibility === "public"
                ? "Anyone can view and import this component."
                : "Only you can view, edit, or import this component"}
            </p>
          </div>
          <div className="grid gap-2 sm:gap-4">
            <div className="grid items-center gap-1.5 sm:gap-2">
              <Label className="text-xs sm:text-sm">Import</Label>
              <InputGroup>
                <InputGroupInput
                  className="font-mono text-sm"
                  value={importText}
                  readOnly
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Copy"
                    title="Copy"
                    size="icon-xs"
                    onClick={() => {
                      copy(importText);
                    }}
                  >
                    {copiedText === importText ? <CheckIcon /> : <CopyIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="grid items-center gap-2">
              <Label className="text-xs sm:text-sm">Link</Label>
              <InputGroup>
                <InputGroupInput
                  className="text-sm"
                  value={linkText}
                  readOnly
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Copy"
                    title="Copy"
                    size="icon-xs"
                    onClick={() => {
                      copy(linkText);
                    }}
                  >
                    {copiedText === linkText ? <CheckIcon /> : <CopyIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="use-slug" className="text-xs sm:text-sm">
                Use slug instead of ID
              </Label>
              <Checkbox
                id="use-slug"
                checked={useSlug}
                onCheckedChange={() => setUseSlug(!useSlug)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

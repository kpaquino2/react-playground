import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { CheckIcon, ChevronDownIcon, CopyIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { Checkbox } from "../ui/checkbox";

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
    `import ${name} from "/` +
    (useSlug ? `@${user?.user_metadata.user_name}/${slug}";` : `${id}";`);
  const linkText =
    (process.env.NODE_ENV === "development"
      ? "localhost:3000/"
      : "react.kpaquino2.dev/") +
    (useSlug ? `@${user?.user_metadata.user_name}/${slug}` : `c/${id}`);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          Share
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
            </h4>
            <p className="text-muted-foreground text-sm">
              {visibility === "public"
                ? "Anyone can view and import this component."
                : "Only you can view, edit, or import this component"}
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid items-center gap-2">
              <Label>Import</Label>
              <InputGroup>
                <InputGroupInput
                  className="font-mono"
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
              <Label>Link</Label>
              <InputGroup>
                <InputGroupInput value={linkText} readOnly />
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
              <Label htmlFor="use-slug">Use slug instead of ID</Label>
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

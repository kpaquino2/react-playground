import { ChevronsDownIcon, ChevronsUpIcon, SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { PreviewSettingsType } from "@/lib/types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ColorPickerPopover } from "./color-picker-popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";

const formSchema = z.object({
  layout: z.enum(["center", "top-left"]),
  padding: z.coerce.number<number>().min(0).max(999),
  background: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

interface PreviewSettingsProps {
  handleCollapseExpand: () => void;
  isCollapsed: boolean;
  previewSettings: PreviewSettingsType;
  setPreviewSettings: (p: PreviewSettingsType) => void;
}

export function PreviewSettings({
  handleCollapseExpand,
  isCollapsed,
  previewSettings,
  setPreviewSettings,
}: PreviewSettingsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: previewSettings,
  });

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      setPreviewSettings(data);
    },
    [setPreviewSettings],
  );

  useEffect(() => {
    const callback = form.subscribe({
      formState: {
        values: true,
      },
      callback: () => {
        form.handleSubmit(onSubmit)();
      },
    });

    return () => callback();
  }, [form, form.subscribe, onSubmit]);

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background z-5 flex h-8 items-center gap-2 border-b px-2">
        <SettingsIcon className="size-5" />
        <p className="flex-1">Preview Settings</p>
        <Button size="icon-sm" variant="ghost" onClick={handleCollapseExpand}>
          {isCollapsed ? <ChevronsUpIcon /> : <ChevronsDownIcon />}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="flex flex-1 flex-col overflow-y-scroll p-8">
          <form
            id="form-preview-settings"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="gap-4">
              <Controller
                name="layout"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel>Preview Layout</FieldLabel>
                      <FieldDescription>
                        Select component render position in preview panel
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroup
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue="center"
                      orientation="horizontal"
                      className="flex"
                    >
                      <FieldLabel htmlFor="center-r2h">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Center</FieldTitle>
                            <div className="grid h-16 w-16 grid-cols-1">
                              <div className="bg-secondary col-start-1 row-start-1 rounded border"></div>
                              <div className="bg-primary text-primary-foreground col-start-1 row-start-1 flex size-6 items-center justify-center place-self-center rounded p-1"></div>
                            </div>
                          </FieldContent>
                          <RadioGroupItem value="center" id="center-r2h" />
                        </Field>
                      </FieldLabel>
                      <FieldLabel htmlFor="topleft-z4k">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Top Left</FieldTitle>
                            <div className="grid h-16 w-16 grid-cols-1">
                              <div className="bg-secondary col-start-1 row-start-1 rounded border"></div>
                              <div className="bg-primary text-primary-foreground col-start-1 row-start-1 flex size-6 items-center justify-center place-self-start rounded p-1"></div>
                            </div>
                          </FieldContent>
                          <RadioGroupItem value="top-left" id="topleft-z4k" />
                        </Field>
                      </FieldLabel>
                    </RadioGroup>
                  </Field>
                )}
              />
              <Controller
                name="padding"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <FieldLabel htmlFor="padding-field" className="w-full">
                      Padding
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="padding-field"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      <InputGroupAddon align="inline-end">px</InputGroupAddon>
                    </InputGroup>
                  </Field>
                )}
              />
              <Controller
                name="background"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <FieldLabel htmlFor="background-field" className="w-full">
                      Background Color
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="background-field"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      <InputGroupAddon align="inline-end">
                        <ColorPickerPopover
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>
      )}
    </div>
  );
}

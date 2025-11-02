import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { type Component } from "@/lib/types";
import { useEffect } from "react";
import { useUpdateComponent } from "@/lib/hooks/components/use-update-component";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Component name is required.")
    .max(64, "Component name must be at most 64 characters."),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(32, "Slug must at most be 32 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug should only contain lowercase letters, numbers, and hyphens.",
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug cannot start or end with a hyphen, or have consecutive hyphens",
    ),
  visibility: z.enum(["public", "private"]),
});

interface ComponentDialogProps {
  component?: Component;
  setComponent: (c?: Component) => void;
}

export function UpdateComponentDialog({
  component,
  setComponent,
}: ComponentDialogProps) {
  const { isMutating, trigger } = useUpdateComponent({
    onError: (e) => toast.error(e.userMessage),
    onSuccess: () => {
      toast.success("Successfully updated a component!");
      onOpenChange();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      visibility: "public",
    },
  });

  useEffect(() => {
    if (component) {
      form.reset({
        name: component.name || "",
        slug: component.slug || "",
        visibility: component.visibility || "public",
      });
    }
  }, [component, form]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    trigger({ id: component?.id, ...data });
  }

  function onOpenChange() {
    setComponent(undefined);
    form.reset();
  }

  return (
    <Dialog open={!!component} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Component</DialogTitle>
          <DialogDescription>Configure component properties.</DialogDescription>
        </DialogHeader>
        <form
          id="update-form-components"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name-field">Component Name</FieldLabel>
                  <Input
                    {...field}
                    id="name-field"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Dropdown Menu"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="slug-field">Slug</FieldLabel>
                  <Input
                    {...field}
                    id="slug-field"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. dropdown-menu"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="visibility"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="visibility-field">Visibility</FieldLabel>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger id="visibility-field">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="update-form-components"
            disabled={isMutating}
          >
            {isMutating ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

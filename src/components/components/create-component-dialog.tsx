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
import { useCreateComponent } from "@/lib/hooks/components/use-create-component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";

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
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateComponentDialog({ open, setOpen }: ComponentDialogProps) {
  const { isMutating, trigger } = useCreateComponent({
    onError: (e) => toast.error(e.userMessage),
    onSuccess: () => {
      toast.success("Successfully created a component!");
      onOpenChange(false);
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

  function onSubmit(data: z.infer<typeof formSchema>) {
    trigger(data);
  }

  function onOpenChange(open: boolean) {
    setOpen(open);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form id="form-component" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Component</DialogTitle>
            <DialogDescription>
              Configure component properties.
            </DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="form-component" disabled={isMutating}>
              {isMutating ? (
                <>
                  <Spinner /> Creating...
                </>
              ) : (
                "Create Component"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

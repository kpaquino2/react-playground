import { Controller, type UseFormReturn } from "react-hook-form";
import { FieldGroup, Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import z from "zod";

export const componentFormSchema = z.object({
  name: z
    .string()
    .min(1, "Component name is required.")
    .max(32, "Component name must be at most 32 characters.")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Component name should only contain letters and numbers.",
    )
    .regex(
      /^[A-Z][a-zA-Z0-9]*$/,
      "Component name must start with an uppercase letter.",
    ),
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

interface ComponentFormProps {
  id: string;
  form: UseFormReturn<z.infer<typeof componentFormSchema>>;
  onSubmit: (data: z.infer<typeof componentFormSchema>) => void;
}

export function ComponentForm({ id, form, onSubmit }: ComponentFormProps) {
  const samples = [
    "DropdownMenu",
    "ProductCard",
    "SiteHeader",
    "LoginForm",
    "CommentsSection",
  ];
  const getSample = (type: "slug" | "name") => {
    const index = new Date().getSeconds() % samples.length;
    const s = samples[index];
    return (
      "e.g. " +
      (type === "name"
        ? s
        : s.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`).slice(1))
    );
  };

  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)}>
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
                placeholder={getSample("name")}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                placeholder={getSample("slug")}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
  );
}

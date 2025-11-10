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
import type z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { type Component } from "@/lib/types";
import { useEffect } from "react";
import { useUpdateComponent } from "@/lib/hooks/components/use-update-component";
import { ComponentForm, componentFormSchema } from "./component-form";
import { useConfirm } from "@/lib/context/confirm-context";

interface ComponentDialogProps {
  component?: Component;
  setComponent: (c?: Component) => void;
  updateParentComponent?: (c: Component) => void;
}

export function UpdateComponentDialog({
  component,
  setComponent,
  updateParentComponent,
}: ComponentDialogProps) {
  const { isMutating, trigger } = useUpdateComponent({
    onError: (e) => toast.error(e.userMessage),
    onSuccess: (c) => {
      toast.success("Successfully updated a component!");
      updateParentComponent?.(c);
      onOpenChange();
    },
  });

  const form = useForm<z.infer<typeof componentFormSchema>>({
    resolver: zodResolver(componentFormSchema),
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

  const { confirm } = useConfirm();

  async function onSubmit(data: z.infer<typeof componentFormSchema>) {
    const changes: string[] = [];
    if (data.slug !== component?.slug) changes.push("Slug");
    if (data.visibility !== component?.visibility) changes.push("Visibility");
    const confirmed =
      changes.length > 0
        ? await confirm({
            title: `Update Component ${changes.join(" and ")}?`,
            message:
              "Changes might break components that import this component.",
            confirmText: "Update",
          })
        : true;
    if (!confirmed) return;
    await trigger({ id: component?.id, ...data });
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
        <ComponentForm
          id="update-form-components"
          form={form}
          onSubmit={onSubmit}
        />
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

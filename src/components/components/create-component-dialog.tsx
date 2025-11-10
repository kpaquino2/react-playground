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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateComponent } from "@/lib/hooks/components/use-create-component";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { ComponentForm, componentFormSchema } from "./component-form";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface ComponentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateComponentDialog({ open, setOpen }: ComponentDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { isMutating, trigger } = useCreateComponent({
    onError: (e) => {
      setSubmitted(false);
      toast.error(e.userMessage);
    },
    onSuccess: (c) => {
      toast.success("Successfully created a component!");
      router.push(`/c/${c.id}`);
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

  function onSubmit(data: z.infer<typeof componentFormSchema>) {
    setSubmitted(true);
    trigger(data);
  }

  function onOpenChange(open: boolean) {
    setOpen(open);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Component</DialogTitle>
          <DialogDescription>Configure component properties.</DialogDescription>
        </DialogHeader>
        <ComponentForm id="form-component" form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="form-component"
            disabled={isMutating || submitted}
          >
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
    </Dialog>
  );
}

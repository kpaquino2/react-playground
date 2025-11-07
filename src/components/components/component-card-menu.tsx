import { EllipsisIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeleteComponent } from "@/lib/hooks/components/use-delete-component";
import { toast } from "sonner";
import { useConfirm } from "@/lib/context/confirm-context";

interface ComponentCardMenuProps {
  componentId: string;
  editComponent: () => void;
}

export function ComponentCardMenu({
  componentId,
  editComponent,
}: ComponentCardMenuProps) {
  const { isMutating, trigger } = useDeleteComponent({
    onError: (e) => toast.error(e.userMessage),
    onSuccess: () => toast.success("Successfully deleted a component!"),
  });

  const { confirm } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Component?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
    });

    if (!confirmed) return;
    await trigger(componentId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuItem
          disabled={isMutating}
          onClick={(e) => e.stopPropagation()}
          onSelect={editComponent}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isMutating}
          onClick={(e) => e.stopPropagation()}
          onSelect={handleDelete}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

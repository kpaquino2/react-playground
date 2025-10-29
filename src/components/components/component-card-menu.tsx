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
          onSelect={() => trigger(componentId)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

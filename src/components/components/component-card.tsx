import { Component } from "@/lib/types";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { LockKeyholeIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ComponentCardMenu } from "./component-card-menu";

interface ComponentCardProps {
  component: Component;
  setEditComponent: (c: Component) => void;
}

export function ComponentCard({
  component,
  setEditComponent,
}: ComponentCardProps) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>{component.name}</CardTitle>
        <CardDescription>{component.slug}</CardDescription>
        <CardAction>
          <ComponentCardMenu
            editComponent={() => {
              setEditComponent(component);
            }}
          />
        </CardAction>
      </CardHeader>
      <CardFooter className="text-muted-foreground justify-between">
        <p className="text-xs">
          {formatDistanceToNow(component.updated_at || "", { addSuffix: true })}
        </p>
        {component.visibility === "private" && (
          <LockKeyholeIcon className="stroke-1.5 size-4" />
        )}
      </CardFooter>
    </Card>
  );
}

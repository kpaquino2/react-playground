import { Component } from "@/lib/types";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { EllipsisIcon, LockKeyholeIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ComponentCardProps {
  component: Component;
}

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>{component.name}</CardTitle>
        <CardDescription>{component.slug}</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm">
            <EllipsisIcon />
          </Button>
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

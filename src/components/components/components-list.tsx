"use client";

import { useUserComponents } from "@/lib/hooks/components/use-user-components";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Button } from "../ui/button";
import { RiAddLargeFill, RiCodeSSlashLine } from "@remixicon/react";
import { CreateComponentDialog } from "./create-component-dialog";
import { UpdateComponentDialog } from "./update-component-dialog";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { ComponentCard } from "./component-card";
import { type Component } from "@/lib/types";

export function ComponentsList() {
  const { data, error, isLoading } = useUserComponents();
  const [openCreateComponentDailog, setOpenCreateComponentDialog] =
    useState(false);
  const [openUpdateComponentDailog, setOpenUpdateComponentDialog] =
    useState<Component>();

  return (
    <>
      <CreateComponentDialog
        open={openCreateComponentDailog}
        setOpen={setOpenCreateComponentDialog}
      />
      <UpdateComponentDialog
        component={openUpdateComponentDailog}
        setComponent={setOpenUpdateComponentDialog}
      />
      <div className="my-4 flex items-center justify-between">
        <p className="text-xl">Components</p>
        {data && data.length > 0 && (
          <Button size="sm" onClick={() => setOpenCreateComponentDialog(true)}>
            <RiAddLargeFill />
            Create Component
          </Button>
        )}
      </div>
      <div className="mb-4 flex flex-wrap gap-4">
        {isLoading ? (
          <div className="grid h-96 w-full place-items-center">
            <div className="flex flex-col items-center">
              <Spinner className="size-9" />
              <p className="font-semibold">Loading...</p>
            </div>
          </div>
        ) : data && data.length > 0 ? (
          data.map((c) => (
            <ComponentCard
              key={c.id}
              component={c}
              setEditComponent={setOpenUpdateComponentDialog}
            />
          ))
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RiCodeSSlashLine />
              </EmptyMedia>
              <EmptyTitle>No Components Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any components yet. Get started by
                creating your first component.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button onClick={() => setOpenCreateComponentDialog(true)}>
                  <RiAddLargeFill />
                  Create Component
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </>
  );
}

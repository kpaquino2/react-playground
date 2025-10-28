"use client";

import { useUserComponents } from "@/lib/hooks/components/useUserComponents";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Button } from "../ui/button";
import { RiAddLargeFill, RiAddLine, RiCodeSSlashLine } from "@remixicon/react";
import { ComponentDialog } from "./component-dialog";
import { useState } from "react";

const ComponentsList = () => {
  const { data, error, isLoading } = useUserComponents();
  const [openComponentDialog, setOpenComponentDialog] = useState(false);
  return (
    <>
      <ComponentDialog
        open={openComponentDialog}
        setOpen={setOpenComponentDialog}
      />
      <div className="my-4 flex items-center justify-between">
        <p className="text-xl">Components</p>
        {data && data.length > 0 && (
          <Button size="sm" onClick={() => setOpenComponentDialog(true)}>
            <RiAddLargeFill />
            Create Component
          </Button>
        )}
      </div>
      <div className="flex flex-wrap">
        {data && data.length > 0 ? (
          data.map((c) => <div key={c.id}>{c.id}</div>)
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
                <Button onClick={() => setOpenComponentDialog(true)}>
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
};

export default ComponentsList;

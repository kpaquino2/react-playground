"use client";

import { type Component } from "@/lib/types";
import { ComponentEditorHeader } from "./component-editor-header";
import { Editor } from "./editor";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable";
import { Preview, type PreviewRef } from "./preview";
import { useRef, useState } from "react";
import { useUpdateComponent } from "@/lib/hooks/components/use-update-component";
import { useDebouncedCallback } from "use-debounce";

interface ComponentEditorProps {
  component: Component;
}

export function ComponentEditor({ component }: ComponentEditorProps) {
  const previewRef = useRef<PreviewRef>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState(component.code);
  const { trigger, isMutating: isSaving } = useUpdateComponent({
    onSuccess: (c) => setCode(c.code),
  });

  const handleRun = async () => {
    if (!previewRef.current) return;

    setIsRunning(true);
    try {
      await previewRef.current.refresh();
    } finally {
      setIsRunning(false);
    }
  };

  const debouncedSetCode = useDebouncedCallback((c: string) => {
    trigger({ code: c, id: component.id });
  }, 1000);

  return (
    <main className="flex h-screen flex-col">
      <ComponentEditorHeader
        {...component}
        run={handleRun}
        isRunning={isRunning}
        isSaving={isSaving}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel>
          <Editor code={code} setCode={debouncedSetCode} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Preview ref={previewRef} name={component.name} code={code} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

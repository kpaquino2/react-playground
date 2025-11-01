"use client";

import type { Log } from "@/lib/types";
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
import { Console } from "./console";
import { type ImperativePanelHandle } from "react-resizable-panels";

// TODO preview settings
// TODO vanity link/slugs
// TODO visibility tests
// TODO collaborators
// TODO share button

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
  const [logs, setLogs] = useState<Array<Log>>([]);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  const handleRun = async () => {
    if (!previewRef.current) return;
    setLogs([]);
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

  const handleAddLog = (l: Log) => {
    setLogs((prev) => [...prev, l]);
  };

  const consolePanelRef = useRef<ImperativePanelHandle>(null);
  const handleCollapseExpand = () => {
    const panel = consolePanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) {
      panel.expand();
    } else {
      panel.collapse();
    }
  };

  const handleCollapse = () => setIsConsoleCollapsed(true);

  const handleExpand = () => setIsConsoleCollapsed(false);

  return (
    <main className="flex h-screen flex-col">
      <ComponentEditorHeader
        {...component}
        run={handleRun}
        isRunning={isRunning}
        isSaving={isSaving}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50}>
          <Editor code={code} setCode={debouncedSetCode} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75}>
              <Preview
                ref={previewRef}
                name={component.name}
                code={code}
                addLog={handleAddLog}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              ref={consolePanelRef}
              collapsible
              defaultSize={25}
              collapsedSize={3}
              minSize={10}
              onCollapse={handleCollapse}
              onExpand={handleExpand}
              className="transition"
            >
              <Console
                logs={logs}
                handleCollapseExpand={handleCollapseExpand}
                isCollapsed={isConsoleCollapsed}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

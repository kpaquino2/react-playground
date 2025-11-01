"use client";

import type { Log } from "@/lib/types";
import type { PreviewSettingsType, Component } from "@/lib/types";
import { ComponentEditorHeader } from "./component-editor-header";
import { Editor } from "./editor";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable";
import { Preview, type PreviewRef } from "./preview";
import { useEffect, useRef, useState } from "react";
import { useUpdateComponent } from "@/lib/hooks/components/use-update-component";
import { useDebouncedCallback } from "use-debounce";
import { Console } from "./console";
import { type ImperativePanelHandle } from "react-resizable-panels";
import { PreviewSettings } from "./preview-settings";

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
  const { trigger, isMutating: isSaving } = useUpdateComponent();
  const [logs, setLogs] = useState<Array<Log>>([]);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const [isPreviewSettingsCollapsed, setIsPreviewSettingsCollapsed] =
    useState(false);

  const [previewSettings, setPreviewSettings] = useState<PreviewSettingsType>(
    component.preview_settings || {
      background: "#09090b",
      layout: "center",
      padding: 16,
    },
  );

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

  const debouncedSetPreviewSettings = useDebouncedCallback(
    (p: PreviewSettingsType) => {
      trigger({ preview_settings: p, id: component.id });
    },
    1000,
  );

  const handleAddLog = (l: Log) => {
    setLogs((prev) => [...prev, l]);
  };

  const consolePanelRef = useRef<ImperativePanelHandle>(null);
  const previewSettingsPanelRef = useRef<ImperativePanelHandle>(null);

  const handleConsoleCollapseExpand = () => {
    const panel = consolePanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) {
      panel.expand();
    } else {
      panel.collapse();
    }
  };

  const handlePreviewSettingsCollapseExpand = () => {
    const panel = previewSettingsPanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) {
      panel.expand();
    } else {
      panel.collapse();
    }
  };

  const handleConsoleCollapse = () => setIsConsoleCollapsed(true);

  const handleConsoleExpand = () => setIsConsoleCollapsed(false);

  const handlePreviewSettingsCollapse = () =>
    setIsPreviewSettingsCollapsed(true);

  const handlePreviewSettingsExpand = () =>
    setIsPreviewSettingsCollapsed(false);

  useEffect(() => {
    handleRun();
  }, [previewSettings]);

  return (
    <main className="flex h-screen flex-col">
      <ComponentEditorHeader
        {...component}
        run={handleRun}
        isRunning={isRunning}
        isSaving={isSaving}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={25}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75} minSize={25}>
              <Editor
                code={code}
                setCode={(c) => {
                  setCode(c);
                  debouncedSetCode(c);
                }}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              ref={consolePanelRef}
              collapsible
              defaultSize={25}
              collapsedSize={3}
              minSize={10}
              onCollapse={handleConsoleCollapse}
              onExpand={handleConsoleExpand}
              className="transition"
            >
              <Console
                logs={logs}
                handleCollapseExpand={handleConsoleCollapseExpand}
                isCollapsed={isConsoleCollapsed}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75} minSize={25}>
              <Preview
                ref={previewRef}
                name={component.name}
                code={code}
                addLog={handleAddLog}
                previewSettings={previewSettings}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              ref={previewSettingsPanelRef}
              collapsible
              defaultSize={25}
              collapsedSize={3}
              minSize={10}
              onCollapse={handlePreviewSettingsCollapse}
              onExpand={handlePreviewSettingsExpand}
              className="transition"
            >
              <PreviewSettings
                handleCollapseExpand={handlePreviewSettingsCollapseExpand}
                isCollapsed={isPreviewSettingsCollapsed}
                previewSettings={previewSettings}
                setPreviewSettings={(p) => {
                  setPreviewSettings(p);
                  debouncedSetPreviewSettings(p);
                }}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

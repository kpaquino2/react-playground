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
import { useAuth } from "@/lib/context/auth-context";
import { UpdateComponentDialog } from "../components/update-component-dialog";

// TODO 'are you sure' dialog
// TODO optimizations
// TODO clean component editor header
// TODO unauth trial
// TODO redirect after creating component
// TODO prettier
// TODO collaborators

interface ComponentEditorProps {
  initComponent: Component;
}

export function ComponentEditor({ initComponent }: ComponentEditorProps) {
  const { user } = useAuth();
  const [component, setComponent] = useState(initComponent);
  const readOnly = initComponent.created_by !== user?.id;
  const previewRef = useRef<PreviewRef>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { trigger, isMutating: isSaving } = useUpdateComponent();
  const [logs, setLogs] = useState<Array<Log>>([]);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const [isPreviewSettingsCollapsed, setIsPreviewSettingsCollapsed] =
    useState(false);
  const [openUpdateComponentDailog, setOpenUpdateComponentDialog] =
    useState<Component>();

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
    trigger({ code: c, id: initComponent.id });
  }, 1000);

  const debouncedSetPreviewSettings = useDebouncedCallback(
    (p: PreviewSettingsType) => {
      trigger({ preview_settings: p, id: initComponent.id });
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
  }, [component.preview_settings]);

  return (
    <main className="flex h-screen flex-col">
      <UpdateComponentDialog
        component={openUpdateComponentDailog}
        setComponent={setOpenUpdateComponentDialog}
        updateParentComponent={setComponent}
      />
      <ComponentEditorHeader
        {...component}
        run={handleRun}
        isRunning={isRunning}
        isSaving={isSaving}
        readOnly={readOnly}
        setOpenUpdateComponentDialog={setOpenUpdateComponentDialog}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={25}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75} minSize={25}>
              <Editor
                code={component.code}
                setCode={(c) => {
                  setComponent((prev) => ({ ...prev, code: c }));
                  if (!readOnly) debouncedSetCode(c);
                }}
                readOnly={readOnly}
                handleRun={handleRun}
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
                id={initComponent.id}
                name={component.name}
                code={component.code}
                addLog={handleAddLog}
                previewSettings={component.preview_settings}
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
                previewSettings={component.preview_settings}
                setPreviewSettings={(p) => {
                  setComponent((prev) => ({ ...prev, preview_settings: p }));
                  if (!readOnly) debouncedSetPreviewSettings(p);
                }}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

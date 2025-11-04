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
import { useRef, useState } from "react";
import { useUpdateComponent } from "@/lib/hooks/components/use-update-component";
import { useDebouncedCallback } from "use-debounce";
import { Console } from "./console";
import { type ImperativePanelHandle } from "react-resizable-panels";
import { PreviewSettings } from "./preview-settings";
import { useAuth } from "@/lib/context/auth-context";
import { UpdateComponentDialog } from "../components/update-component-dialog";
import { useWindowSize } from "@/lib/hooks/use-window-size";
import {
  ChevronsDownIcon,
  ChevronsUpIcon,
  CodeXmlIcon,
  FullscreenIcon,
  SettingsIcon,
  TerminalSquareIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import prettier from "prettier/standalone";
import parserTypeScript from "prettier/parser-typescript";
import prettierPluginEstree from "prettier/plugins/estree";

// TODO readme.md
// TODO 'are you sure' dialog
// TODO optimizations
// TODO collaboration
// TODO list of dependencies
// TODO make a copy of component
// TODO tutorial
// TODO component form
// TODO component name strict
// TODO improve preview

interface ComponentEditorProps {
  initComponent: Component;
}

export function ComponentEditor({ initComponent }: ComponentEditorProps) {
  const { user } = useAuth();
  const [component, setComponent] = useState(initComponent);
  const trialMode = initComponent.id === "trial-component";
  const readOnly = !trialMode && initComponent.created_by !== user?.id;
  const previewRef = useRef<PreviewRef>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { trigger, isMutating: isSaving } = useUpdateComponent();
  const [logs, setLogs] = useState<Array<Log>>([]);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const [isPreviewSettingsCollapsed, setIsPreviewSettingsCollapsed] =
    useState(false);
  const [openUpdateComponentDailog, setOpenUpdateComponentDialog] =
    useState<Component>();
  const { width } = useWindowSize();

  const handleRun = async (editorCode: string) => {
    if (!previewRef.current) return;
    setLogs([]);
    setIsRunning(true);
    try {
      const c = await prettier.format(editorCode, {
        parser: "typescript",
        plugins: [parserTypeScript, prettierPluginEstree],
      });
      setComponent((prev) => ({ ...prev, code: c }));
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

  const handleSetCode = (c: string) => {
    setComponent((prev) => ({ ...prev, code: c }));
    if (!trialMode && !readOnly) debouncedSetCode(c);
  };

  const handleSetPreviewSettings = (p: PreviewSettingsType) => {
    setComponent((prev) => ({ ...prev, preview_settings: p }));
    if (!trialMode && !readOnly) debouncedSetPreviewSettings(p);
    handleRun(component.code);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
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
        trialMode={trialMode}
        setOpenUpdateComponentDialog={setOpenUpdateComponentDialog}
      />
      <ResizablePanelGroup
        direction={width > 900 ? "horizontal" : "vertical"}
        className="flex-1"
      >
        <ResizablePanel defaultSize={50} minSize={25}>
          <ResizablePanelGroup direction="vertical">
            <div className="bg-background z-5 flex h-8 items-center gap-2 border-b px-2">
              <CodeXmlIcon className="size-5" />
              <p className="flex-1">Code</p>
            </div>
            <ResizablePanel defaultSize={75} minSize={25}>
              <Editor
                code={component.code}
                setCode={handleSetCode}
                readOnly={readOnly}
                handleRun={handleRun}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <div className="bg-background z-5 flex h-8 items-center gap-2 border-b px-2">
              <TerminalSquareIcon className="size-5" />
              <p className="flex-1">Console</p>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={handleConsoleCollapseExpand}
              >
                {isConsoleCollapsed ? <ChevronsUpIcon /> : <ChevronsDownIcon />}
              </Button>
            </div>
            <ResizablePanel
              ref={consolePanelRef}
              collapsible
              defaultSize={25}
              minSize={10}
              onCollapse={handleConsoleCollapse}
              onExpand={handleConsoleExpand}
            >
              <Console logs={logs} isCollapsed={isConsoleCollapsed} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          <ResizablePanelGroup direction="vertical">
            <div className="bg-background z-5 flex h-8 items-center gap-2 border-b px-2">
              <FullscreenIcon className="size-5" />
              <p className="flex-1">Preview</p>
            </div>
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
            <div className="bg-background z-5 flex h-8 items-center gap-2 border-b px-2">
              <SettingsIcon className="size-5" />
              <p className="flex-1">Preview Settings</p>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={handlePreviewSettingsCollapseExpand}
              >
                {isPreviewSettingsCollapsed ? (
                  <ChevronsUpIcon />
                ) : (
                  <ChevronsDownIcon />
                )}
              </Button>
            </div>
            <ResizablePanel
              ref={previewSettingsPanelRef}
              collapsible
              defaultSize={25}
              minSize={10}
              onCollapse={handlePreviewSettingsCollapse}
              onExpand={handlePreviewSettingsExpand}
            >
              <PreviewSettings
                previewSettings={component.preview_settings}
                setPreviewSettings={handleSetPreviewSettings}
                isCollapsed={isPreviewSettingsCollapsed}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

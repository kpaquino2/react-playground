"use client";

import { type Monaco, Editor as MonacoEditor } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
interface EditorProps {
  code: string;
  setCode: (v: string) => void;
}

export function Editor({ code, setCode }: EditorProps) {
  const handleEditorWillMount = (monaco: Monaco) => {
    // Determine which defaults to configure based on language
    const languageDefaults = monaco.languages.typescript.typescriptDefaults;

    // Configure compiler options for JSX
    languageDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: "React.createElement",
      jsxFragmentFactory: "React.Fragment",
      reactNamespace: "React",
      allowNonTsExtensions: true,
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      skipLibCheck: true,
    });

    // Add React type definitions
    languageDefaults.addExtraLib(
      `
      declare namespace React {
        type ReactNode = any;
        type JSXElementConstructor<P> = any;
        type ComponentType<P = {}> = any;
        type ReactElement = any;
        
        function createElement(
          type: any,
          props?: any,
          ...children: any[]
        ): ReactElement;
        
        function useState<T>(
          initialState: T | (() => T)
        ): [T, (value: T | ((prev: T) => T)) => void];
        
        function useEffect(
          effect: () => void | (() => void),
          deps?: any[]
        ): void;
        
        function useRef<T>(initialValue: T): { current: T };
        
        function useCallback<T extends (...args: any[]) => any>(
          callback: T,
          deps: any[]
        ): T;
        
        function useMemo<T>(factory: () => T, deps: any[]): T;
        
        function useContext<T>(context: any): T;
        
        function useReducer<R extends (state: any, action: any) => any>(
          reducer: R,
          initialState: any
        ): [any, (action: any) => void];
        
        const Fragment: ComponentType;
      }
      
      declare module 'react' {
        export = React;
      }
      
      // Add common prop types
      interface HTMLAttributes<T> {
        className?: string;
        style?: any;
        onClick?: (e: any) => void;
        onChange?: (e: any) => void;
        children?: React.ReactNode;
        [key: string]: any;
      }
      
      // JSX intrinsic elements
      declare namespace JSX {
        interface IntrinsicElements {
          div: HTMLAttributes<HTMLDivElement>;
          span: HTMLAttributes<HTMLSpanElement>;
          button: HTMLAttributes<HTMLButtonElement>;
          input: HTMLAttributes<HTMLInputElement>;
          h1: HTMLAttributes<HTMLHeadingElement>;
          h2: HTMLAttributes<HTMLHeadingElement>;
          h3: HTMLAttributes<HTMLHeadingElement>;
          p: HTMLAttributes<HTMLParagraphElement>;
          a: HTMLAttributes<HTMLAnchorElement>;
          ul: HTMLAttributes<HTMLUListElement>;
          ol: HTMLAttributes<HTMLOListElement>;
          li: HTMLAttributes<HTMLLIElement>;
          img: HTMLAttributes<HTMLImageElement>;
          form: HTMLAttributes<HTMLFormElement>;
          label: HTMLAttributes<HTMLLabelElement>;
          [elemName: string]: any;
        }
        
        interface Element extends React.ReactElement {}
        interface ElementClass extends React.ComponentType {}
        interface ElementAttributesProperty { props: {}; }
        interface ElementChildrenAttribute { children: {}; }
      }
      `,
      "ts:react.d.ts",
    );

    // Configure diagnostics - disable errors that don't matter in playground
    languageDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [
        1308, // 'await' expressions are only allowed at the top level
        2307, // Cannot find module
        2792, // Cannot find module (ESM)
        2304, // Cannot find name (for undeclared imports)
        7016, // Could not find declaration file for module
        6133, // Variable declared but never used
        80001, // File is a CommonJS module
      ],
    });

    // Disable Emmet for cleaner autocomplete
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  };

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // update(componentRef.current.id, editor.getValue());
      // setHasUnsavedChanges(false);
      // console.log("Save triggered (custom handler)");
    });
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs-dark", // or 'vs', 'hc-black'
      inherit: true,
      rules: [], // Add custom token rules here if needed
      colors: {
        "editor.background": "#09090b", // Your desired background color
        // Add other editor color customizations here if needed
      },
    });
    editor.focus();
  };

  const handleChange = (v: string | undefined) => {
    setCode(v || "");
  };

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="typescript"
      defaultValue={code}
      theme="myCustomTheme"
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      onChange={handleChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        padding: { top: 8, bottom: 8 },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        snippetSuggestions: "top",
        formatOnPaste: true,
        formatOnType: true,
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        scrollbar: {
          vertical: "visible",
          horizontal: "visible",
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      }}
    />
  );
}

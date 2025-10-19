"use client";

import { Editor } from "@monaco-editor/react";

const CodeEditor = () => {
  return (
    <div className="w-1/2 h-full">
      <Editor
        theme="vs-dark"
        defaultLanguage="typescript"
        defaultValue="// Enter code here"
      />
    </div>
  );
};

export default CodeEditor;

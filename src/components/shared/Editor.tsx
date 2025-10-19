import { Editor as MonacoEditor } from "@monaco-editor/react";

const Editor = ({ code }: { code: string }) => {
  return (
    <MonacoEditor
      theme="vs-dark"
      defaultLanguage="typescript"
      defaultValue={code}
    />
  );
};

export default Editor;

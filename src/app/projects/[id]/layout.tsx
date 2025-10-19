import CodeEditor from "@/components/editor/CodeEditor";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen">
      <CodeEditor />
      {children}
    </div>
  );
}

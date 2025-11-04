import { ComponentEditor } from "@/components/editor/component-editor";
import { createClient } from "@/lib/supabase/server";
import type { Component } from "@/lib/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ComponentPageProps {
  params: Promise<{ id: string }>;
}

async function fetchComponent(id: string) {
  if (id === "trial-component") {
    const component: Component = {
      id: "trial-component",
      code: `// You can import components from Nutshell using their slug or id

import Button from "/@kpaquino2/button"; // slug
// import Button from "/5afc0702";  // id

// Click "Run" or press "Ctrl + S" to see your changes live!

export default function TrialComponent() {
  // React hooks and utilities are available via the React global
  // Use React.useState, React.useEffect, React.useMemo, etc.
  const [count, setCount] = React.useState(0);

  // Console methods work! console.log, console.error, console.warn, console.info all display in the console panel below
  console.info('It works!')

  return (
    // Tailwind CSS works out of the box
    <div className="flex w-72 flex-col gap-4 rounded border-2 border-blue-400 bg-blue-100 p-3 text-blue-800 shadow-lg/50">
      <h1 className="text-xl font-bold">My Component</h1>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setCount(count + 1)}
        >
          +
        </Button>
        <p>{count}</p>
        <Button
          onClick={() => setCount(count - 1)}
        >
          -
        </Button>
      </div>
      <Button
        onClick={() => console.log(count)}
      >
        Print Count
      </Button>
      <p className="text-gray-600">
        Edit this component and click "Run" to see changes.
      </p>
    </div>
  );
}
`,
      created_at: new Date().toISOString(),
      created_by: "",
      description: null,
      name: "TrialComponent",
      slug: "trial-component",
      preview_settings: {
        layout: "center",
        background: "#fff",
        padding: 16,
      },
      props: null,
      tags: null,
      updated_at: new Date().toISOString(),
      visibility: "public",
      views: 0,
    };
    return component;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("components")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === "trial-component") {
    return {
      title: "Nutshell | Trial Component",
      description: "...",
    };
  }

  const component = await fetchComponent(id);
  return {
    title: "Nutshell | " + (component?.name || "404"),
    description: "...",
  };
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { id } = await params;

  const component = await fetchComponent(id);

  if (!component) {
    notFound();
  }

  return <ComponentEditor initComponent={component} />;
}

import { ComponentEditor } from "@/components/editor/component-editor";
import { createClient } from "@/lib/supabase/server";
import type { Component } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Trial component
  if (id === "trial-component") {
    const component: Component = {
      id: "trial-component",
      code: `export default function TrialComponent() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex w-72 flex-col gap-4 rounded border-2 border-blue-400 bg-blue-100 p-3 text-blue-800 shadow-lg/50">
      <h1 className="text-xl font-bold">My Component</h1>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCount(count + 1)}
          className="size-8 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          +
        </button>
        <p>{count}</p>
        <button
          onClick={() => setCount(count - 1)}
          className="size-8 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          -
        </button>
      </div>
      <button
        onClick={() => console.log(count)}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Print Count
      </button>
      <p className="text-gray-600">
        Edit this component and click "Run" to see changes.
      </p>
    </div>
  );
}`,
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

    return <ComponentEditor initComponent={component} />;
  }

  const supabase = await createClient();

  const { data: component, error } = await supabase
    .from("components")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!component) {
    notFound();
  }

  return <ComponentEditor initComponent={component} />;
}

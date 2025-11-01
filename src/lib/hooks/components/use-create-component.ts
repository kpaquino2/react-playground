import { type Component } from "@/lib/types";
import { useSWRMutation } from "../config/use-swr-mutation";
import { AppError, handleSupabaseError } from "@/lib/errors/handler";
import { type SWRMutationConfiguration } from "swr/mutation";
import { type createClient } from "@/lib/supabase/client";

const DEFAULT_CODE = `
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
          onClick={() => setCount(count + 1)}
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
`;

const fetcher = async (
  supabase: ReturnType<typeof createClient>,
  args: Partial<Component>,
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new AppError(
      "User not authenticated",
      "Please sign in to create components",
      "AUTH_REQUIRED",
    );
  }
  const initialCode = `export default function ${
    args.name?.replaceAll(" ", "")
  }() {
  ${DEFAULT_CODE}
}`;

  const { data, error } = await supabase
    .from("components")
    .insert({
      name: args.name?.trim() || "",
      code: initialCode.trim(),
      slug: args.slug?.trim() || "",
      description: args.description,
      visibility: args.visibility || "public",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
};

export function useCreateComponent(
  config?: SWRMutationConfiguration<Component, AppError>,
) {
  return useSWRMutation(
    "my-components",
    fetcher,
    config,
  );
}

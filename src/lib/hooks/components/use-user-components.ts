import type { Component } from "@/lib/types";
import { useSWR } from "../config/use-swr";
import { type createClient } from "@/lib/supabase/client";
import { handleSupabaseError } from "@/lib/errors/handler";
import { useAuth } from "@/lib/context/auth-context";

const fetcher = async (
  supabase: ReturnType<typeof createClient>,
  page: number,
  limit: number,
  userId: string,
) => {
  const start = (page - 1) * limit;
  const end = (page * limit) - 1;
  const { data, count, error } = await supabase
    .from("components")
    .select("*", { count: "exact" })
    .eq("created_by", userId)
    .order("updated_at", { ascending: false })
    .range(start, end);

  if (error) throw handleSupabaseError(error);
  return { components: data || [], count: count || 0 };
};

export function useUserComponents(page: number = 1, limit: number = 24) {
  const { user } = useAuth();

  return useSWR<
    { components: Component[]; count: number },
    [number, number, string]
  >(
    user ? ["my-components", page, limit, user.id] : null,
    fetcher,
  );
}

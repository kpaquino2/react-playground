import type { Component } from "@/lib/types";
import { useSWR } from "../config/use-swr";
import { type createClient } from "@/lib/supabase/client";
import { handleSupabaseError } from "@/lib/errors/handler";

const fetcher = async (
  supabase: ReturnType<typeof createClient>,
  page: number,
  limit: number,
) => {
  const targetUserId = (await supabase.auth.getUser()).data.user?.id;
  if (!targetUserId) return { components: [], count: 0 };
  const start = (page - 1) * limit;
  const end = (page * limit) - 1;
  const { data, count, error } = await supabase
    .from("components")
    .select("*", { count: "exact" })
    .eq("created_by", targetUserId)
    .order("updated_at", { ascending: false })
    .range(start, end);

  if (error) throw handleSupabaseError(error);
  return { components: data || [], count: count || 0 };
};

export function useUserComponents(page: number = 1, limit: number = 24) {
  return useSWR<{ components: Component[]; count: number }, [number, number]>(
    ["my-components", page, limit],
    fetcher,
  );
}

import type { Component } from "@/lib/types";
import { useSWR } from "../config/useSWR";

export function useUserComponents(userId?: string, limit: number = 10) {
  return useSWR<Component[]>(
    userId ? `user-components:${userId}` : "my-components",
    async (supabase) => {
      const targetUserId = userId ||
        (await supabase.auth.getUser()).data.user?.id;
      if (!targetUserId) return [];

      const { data, error } = await supabase
        .from("components")
        .select("*")
        .eq("created_by", targetUserId)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
  );
}

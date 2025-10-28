import { createClient } from "@/lib/supabase/client";
import useSWRDefault, { SWRConfiguration } from "swr";

export function useSWR<T>(
  key: string | null,
  fetcher: (supabase: ReturnType<typeof createClient>) => Promise<T>,
  config?: SWRConfiguration,
) {
  const supabase = createClient();

  return useSWRDefault<T>(
    key,
    () => fetcher(supabase),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...config,
    },
  );
}

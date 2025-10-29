import { AppError } from "@/lib/errors/handler";
import { createClient } from "@/lib/supabase/client";
import useSWRMutationDefault, {
  type SWRMutationConfiguration,
  SWRMutationResponse,
} from "swr/mutation";

// Generic mutation wrapper for Supabase
export function useSWRMutation<T, Args = any>(
  key: string,
  mutator: (
    supabase: ReturnType<typeof createClient>,
    args: Args,
  ) => Promise<T>,
  config?: SWRMutationConfiguration<T, AppError, string, Args>,
): SWRMutationResponse<T, AppError, string, Args> {
  const supabase = createClient();

  return useSWRMutationDefault<T, AppError, string, Args>(
    key,
    async (_, { arg }: { arg: Args }) => mutator(supabase, arg),
    config,
  );
}

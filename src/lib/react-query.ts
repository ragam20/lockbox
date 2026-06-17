import {
  QueryClient,
  type DefaultOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    // throwOnError: true
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  },
} satisfies DefaultOptions;
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;

export function maxRetry(failureCount: number, error): boolean {
  if (error.status === 401) {
    return false;
  }

  return failureCount < 2;
}

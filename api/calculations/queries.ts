// src/api/calculations/queries.ts
import {
  AllRes,
  BmrCalc,
  ByDateRes,
  ByIdRes,
  DeleteReq,
  LatestRes,
  MacrosCalc,
  TdeeCalc,
} from "@/features/home/recentSection/models";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { calculationsClient } from "./client";

/** Query keys */
export const calculationsKeys = {
  root: ["calculations"] as const,
  all: (userId: string) => [...calculationsKeys.root, "all", userId] as const,
  latest: (userId: string) =>
    [...calculationsKeys.root, "latest", userId] as const,
  byDate: (userId: string, start: string, end: string) =>
    [...calculationsKeys.root, "byDate", userId, start, end] as const,
  byId: (userId: string, ids: string[]) =>
    [...calculationsKeys.root, "byId", userId, ...ids] as const,
  byType: (userId: string, type: "BMR" | "TDEE" | "Macros") =>
    [...calculationsKeys.root, "byType", userId, type] as const,
};

const defaultQueryOpts = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
} as const;

/** Helpers */
export const toIso = (d: Date | string) =>
  typeof d === "string" ? new Date(d).toISOString() : d.toISOString();

/** Hooks */

export const useCalculationsAll = (
  userId: string,
  options?: Omit<UseQueryOptions<AllRes>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: calculationsKeys.all(userId),
    queryFn: ({ signal }) => calculationsClient.all({ userId }, signal),
    enabled: !!userId,
    ...defaultQueryOpts,
    ...options,
  });
};

export const useLatestCalculations = (
  userId: string,
  options?: Omit<UseQueryOptions<LatestRes>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: calculationsKeys.latest(userId),
    queryFn: ({ signal }) => calculationsClient.latest({ userId }, signal),
    enabled: !!userId,
    ...defaultQueryOpts,
    ...options,
  });
};

export const useCalculationsByDate = (
  userId: string,
  startDate: string | Date,
  endDate: string | Date,
  options?: Omit<UseQueryOptions<ByDateRes>, "queryKey" | "queryFn">
) => {
  const start = toIso(startDate);
  const end = toIso(endDate);
  return useQuery({
    queryKey: calculationsKeys.byDate(userId, start, end),
    queryFn: ({ signal }) =>
      calculationsClient.byDate(
        { userId, startDate: start, endDate: end },
        signal
      ),
    enabled: !!userId && !!start && !!end,
    ...defaultQueryOpts,
    ...options,
  });
};

export const useCalculationsById = (
  userId: string,
  ids: string[],
  options?: Omit<UseQueryOptions<ByIdRes>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: calculationsKeys.byId(userId, ids),
    queryFn: ({ signal }) => calculationsClient.byId({ userId, ids }, signal),
    enabled: !!userId && ids.length > 0,
    ...defaultQueryOpts,
    ...options,
  });
};

/** Typed byType hook with conditional return */
type ByTypeMap = {
  BMR: BmrCalc[];
  TDEE: TdeeCalc[];
  Macros: MacrosCalc[];
};

export function useCalculationsByType<T extends keyof ByTypeMap>(
  userId: string,
  type: T,
  options?: Omit<UseQueryOptions<ByTypeMap[T]>, "queryKey" | "queryFn">
) {
  // 👇 shim the overloaded function into a generic one
  const byTypeGeneric = calculationsClient.byType as <
    X extends keyof ByTypeMap
  >(
    body: { userId: string; type: X },
    signal?: AbortSignal
  ) => Promise<ByTypeMap[X]>;

  return useQuery({
    queryKey: calculationsKeys.byType(userId, type),
    queryFn: ({ signal }) => byTypeGeneric({ userId, type }, signal),
    enabled: !!userId && !!type,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    ...options,
  });
}

export const useDeleteCalculations = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DeleteReq) => calculationsClient.delete(input),
    onSuccess: (_data, variables) => {
      // Invalidate everything under "calculations"
      qc.invalidateQueries({ queryKey: calculationsKeys.root });
      // (Optionally, target only affected keys)
      // qc.invalidateQueries({ queryKey: calculationsKeys.all(variables.userId) });
      // qc.invalidateQueries({ queryKey: calculationsKeys.latest(variables.userId) });
    },
  });
};

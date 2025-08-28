export const qk = {
  root: ["calculations"] as const,
  all: (userId: string) => ["calculations", "all", userId] as const,
  latest: (userId: string) => ["calculations", "latest", userId] as const,
  byType: (userId: string, type: string, limit?: number) =>
    ["calculations", "byType", userId, type, limit ?? null] as const,
  byDate: (userId: string, from: string, to: string, type?: string) =>
    ["calculations", "byDate", userId, from, to, type ?? "any"] as const,
  byId: (userId: string, ids: string[]) => ["calculations", "byId", userId, ...ids] as const,
};

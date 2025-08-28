export const qk = {
  all: (userId: string) => ["calculations", "all", userId] as const,
  latest: (userId: string) => ["calculations", "latest", userId] as const,
  byType: (userId: string, type: string, limit?: number, offset?: number) =>
    ["calculations", "byType", userId, type, limit ?? null, offset ?? null] as const,
  byDate: (userId: string, from: string, to: string) =>
    ["calculations", "byDate", userId, from, to] as const,
  byId: (userId: string, ids: string[]) => ["calculations", "byId", userId, ...ids] as const,
};

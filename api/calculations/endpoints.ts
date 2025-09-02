// src/api/calculations/endpoints.ts

export const FN = {
  all: "calculations-all",
  byDate: "calculations-by-date",
  byId: "calculations-by-id",
  latest: "calculations-latest",
  byType: "calculations-by-type",
  delete: "calculations-delete",
} as const;

export const functionUrl = (name: string) => {
  const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL");
  return `${base}/functions/v1/${name}`;
};

export const functionHeaders = () => {
  // Strongly recommended by Supabase for calling Edge Functions
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error("Missing EXPO_PUBLIC_SUPABASE_ANON_KEY");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${anonKey}`,
    apikey: anonKey,
  };
};

// src/api/calculators/endpoints.ts

export const FN = {
  bmr: "bmr",
  tdee: "tdee",
  macros: "macros",
  bmi: "bmi",
  bodyComp: "lbm-fatmass",
} as const;

export const functionUrl = (name: string) => {
  const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL");
  return `${base}/functions/v1/${name}`;
};

export const functionHeaders = () => {
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error("Missing EXPO_PUBLIC_SUPABASE_ANON_KEY");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${anonKey}`,
    apikey: anonKey,
  };
};

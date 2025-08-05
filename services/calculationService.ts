import { supabase } from "@/supabase";

// Helper to post a payload to a Supabase Edge Function
export async function postToEdgeFunction(name: string, payload: object): Promise<any> {
  const { data, error } = await supabase.functions.invoke(name, {
    body: payload,
  });
  if (error) throw error;
  return data;
}

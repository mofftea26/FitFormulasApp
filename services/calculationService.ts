import { supabase } from "../supabase";
import { Calculation, CalculationType } from "../types/calculation";

export async function saveCalculation(
  userId: string,
  type: CalculationType,
  result: Record<string, any>,
  input?: Record<string, any>
): Promise<Calculation> {
  const insertData = {
    user_id: userId,
    type,
    result_json: result,
    input_json: input || {},
  };

  const { data, error } = await supabase
    .from("calculations")
    .insert([insertData])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    createdAt: data.created_at,
    userId: data.user_id,
    type: data.type,
    resultJson: data.result_json,
    inputJson: data.input_json,
  };
}

export async function getUserCalculations(
  userId: string
): Promise<Calculation[]> {
  const { data, error } = await supabase
    .from("calculations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    userId: row.user_id,
    type: row.type,
    resultJson: row.result_json,
    inputJson: row.input_json,
  }));
}

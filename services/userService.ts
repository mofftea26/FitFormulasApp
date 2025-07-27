import { supabase } from "../supabase";
import { UserProfile } from "../types/user";

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    createdAt: data.created_at,
    username: data.username,
    gender: data.gender,
    dateOfBirth: data.date_of_birth,
    heightCm: data.height_cm,
    weightKg: data.weight_kg,
  };
}

export async function createUserProfile(
  userData: Omit<UserProfile, "id" | "createdAt">
): Promise<UserProfile> {
  const insertData = {
    username: userData.username,
    gender: userData.gender,
    date_of_birth: userData.dateOfBirth,
    height_cm: userData.heightCm,
    weight_kg: userData.weightKg,
  };

  const { data, error } = await supabase
    .from("users")
    .insert([insertData])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    createdAt: data.created_at,
    username: data.username,
    gender: data.gender,
    dateOfBirth: data.date_of_birth,
    heightCm: data.height_cm,
    weightKg: data.weight_kg,
  };
}

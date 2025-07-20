// supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gxrxyjeacovzbmczydgw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cnh5amVhY292emJtY3p5ZGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjIxMjQsImV4cCI6MjA2ODU5ODEyNH0.IeaRWL_yLXdB1OtLGZYM3PSYuyqmyUiGE4kDedGtguU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

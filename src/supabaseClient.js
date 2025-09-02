import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://YOUR-PROJECT-URL.supabase.co"; // ganti dengan project URL
const supabaseAnonKey = "YOUR-ANON-KEY"; // ganti dengan anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

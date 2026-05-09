import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://lnoboudpaqehidluhglo.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_RcC54729vyS1-SbvtB_HMA_PxY8Bl44";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

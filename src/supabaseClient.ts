import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ozutvzmvfudddfrpdnmx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dXR2em12ZnVkZGRmcnBkbm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTU5OTEsImV4cCI6MjA4NzA3MTk5MX0.EI-6UyUvQlxEpPdtZdn4YFVRLYtTE9dj_y_7bESQTZU";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

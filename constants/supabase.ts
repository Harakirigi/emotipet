import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://ldrolqauxudhxqsshjkz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkcm9scWF1eHVkaHhxc3Noamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzM0NTIsImV4cCI6MjA2NjcwOTQ1Mn0.ke8j-vtZOOqmj1LwhVro_0QIrMY0VTT5rubOOk7lLDU"
);

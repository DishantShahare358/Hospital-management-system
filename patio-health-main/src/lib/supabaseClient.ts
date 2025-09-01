import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nevpvjapeghxxgrmsqix.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ldnB2amFwZWdoeHh4Z3Jtc3FpeCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzU2MzIzMDQ2LCJleHAiOjIwNzE4OTkwNDZ9.xcvCNKrEXGL4ThnIfTZfKDtfzzXIML8sjn5ApO6ecv8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

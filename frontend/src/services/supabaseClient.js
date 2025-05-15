import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://jfqmvaeeelneeawbvkga.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcW12YWVlZWxuZWVhd2J2a2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MDAwNzgsImV4cCI6MjA2MTI3NjA3OH0.B9R9mUucwZCYXSuZPD3PKGcNUfR58Zb4Efb0kyUe2RM';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 
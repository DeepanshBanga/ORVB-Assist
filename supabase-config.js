// MultipleFiles/supabase-config.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||'https://tqmglwjbxsbcpgqprcql.supabase.co'; // Replace with your Supabase Project URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxbWdsd2pieHNiY3BncXByY3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODkzNjUsImV4cCI6MjA3NDI2NTM2NX0.kHVT0_PAoRkuTOLBsay10Pm7tEQWcmyacHDQcrGhuak'; // Replace with your Supabase Public Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client initialized.');
// supabase-config.js
     import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
     const supabaseUrl = 'https://tqmglwjbxsbcpgqprcql.supabase.co';
     const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxbWdsd2pieHNiY3BncXByY3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODkzNjUsImV4cCI6MjA3NDI2NTM2NX0.kHVT0_PAoRkuTOLBsay10Pm7tEQWcmyacHDQcrGhuak';
     export const supabase = createClient(supabaseUrl, supabaseAnonKey);
     console.log('Supabase client initialized:', supabase);  // Verify in console
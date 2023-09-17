import { createClient } from '@supabase/supabase-js'
import { creds } from '../creds'


// Create a single supabase client for interacting with your database
export const supabase = createClient(
    creds.SUPABASE_URL,
    creds.SUPABASE_ANON_KEY,
    {
        persistSession: false
    }
)
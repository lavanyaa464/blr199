import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

console.log("SUPABASE URL:", url)
console.log("SUPABASE KEY exists:", !!key)

if(!url || !key){
  console.error("Missing VITE_SUPABASE_URL or KEY in .env.local")
}

export const supabase = createClient(url, key)
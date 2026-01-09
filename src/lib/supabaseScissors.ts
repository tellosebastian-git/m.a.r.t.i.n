import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Reemplaza estos valores con las credenciales de tu proyecto Supabase "Scissors"
const SCISSORS_URL = 'TU_SUPABASE_URL_AQUI';
const SCISSORS_ANON_KEY = 'TU_ANON_KEY_AQUI';

export const supabaseScissors = createClient(SCISSORS_URL, SCISSORS_ANON_KEY);

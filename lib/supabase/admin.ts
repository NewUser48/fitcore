import { createClient } from "@supabase/supabase-js";

/**
 * Service Role Admin Client
 * ⚠️ SERVER-SIDE ONLY: Never expose to the browser!
 * Used by the trainer to securely register and provision new member Auth accounts
 * using supabase.auth.admin.createUser().
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

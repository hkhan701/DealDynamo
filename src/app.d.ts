import { SupabaseClient, Session } from "@supabase/supabase-js"
import { Database } from "./DatabaseDefinitions"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      supabaseServiceRole: SupabaseClient<Database>
      safeGetSession(): Promise<{ session: Session | null; user: User | null }>
    }
    interface PageData {
      session: Session | null
      profile: Database["public"]["Tables"]["profiles"]["Row"] | null
      userSettings: Database["public"]["Tables"]["user_settings"]["Row"] | null
    }
    // interface Error {}
    // interface Platform {}
  }
}

export {}


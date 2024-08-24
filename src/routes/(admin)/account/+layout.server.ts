import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession()

  if (!session) {
    throw redirect(303, "/login")
  }

  const [{ data: profile }, { data: userSettings }] = await Promise.all([
    supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session.user.id)
      .single(),
    supabase
      .from("user_settings")
      .select(`*`)
      .eq("user_id", session.user.id)
      .single()
  ])

  return { session, profile, userSettings }
}
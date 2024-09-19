import { fail, redirect } from "@sveltejs/kit"

export const actions = {
  updateUserSettings: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      throw redirect(303, "/login")
    }
  
    const formData = await request.formData()
    const runningStatus = formData.get("runningStatus") === "on"
    const country = formData.get("country") as string
    const minimumSavingsThreshold = parseInt(formData.get("minimumSavingsThreshold") as string, 10) || 0
    const cleanupDaysThreshold = parseInt(formData.get("cleanupDaysThreshold") as string, 10) || 0
    const maximumPostsPerSession = parseInt(formData.get("maximumPostsPerSession") as string, 10) || 0
    const delayBetweenPosts = parseInt(formData.get("delayBetweenPosts") as string, 10) || 0
    const delayBetweenSessions = parseInt(formData.get("delayBetweenSessions") as string, 10) || 0
    const recentlyUpdatedHourThreshold = parseInt(formData.get("recentlyUpdatedHourThreshold") as string, 10) || 0
    const specialMessageThreshold = parseInt(formData.get("specialMessageThreshold") as string, 10) || 0
    const randomImageToggle = formData.get("randomImageToggle") === "on"
    const deeplinkToggle = formData.get("deeplinkToggle") === "on"
    const associateTag = formData.get("associateTag") as string
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string
    const fbGroupLink = formData.get("fbGroupLink") as string
    const fbPageId = formData.get("fbPageId") as string
    const accessToken = formData.get("accessToken") as string
    const firstLineMessage = formData.get("firstLineMessage") as string
    const bottomLineMessage = formData.get("bottomLineMessage") as string
    
    // Parse logins
    const logins = [
      { email: formData.get("logins[0].email") as string, password: formData.get("logins[0].password") as string },
      { email: formData.get("logins[1].email") as string, password: formData.get("logins[1].password") as string },
      { email: formData.get("logins[2].email") as string, password: formData.get("logins[2].password") as string },
    ]

        // Validation
      const errors = []

      if (minimumSavingsThreshold <= 0) {
        errors.push("Minimum savings threshold must be a positive number")
      }
  
      if (cleanupDaysThreshold <= 0) {
        errors.push("Clean up days threshold must be a positive number")
      }
  
      if (maximumPostsPerSession <= 0) {
        errors.push("Maximum posts per session must be a positive number")
      }
  
      if (delayBetweenPosts <= 60 || delayBetweenPosts <= 0) {
        errors.push("Delay between posts must be above 60 seconds and a positive number")
      }
  
      if (delayBetweenSessions <= 60 || delayBetweenSessions <= 0) {
        errors.push("Delay between sessions must be above 60 seconds and a positive number")
      }
  
      if (recentlyUpdatedHourThreshold < 1) {
        errors.push("Recently updated hour threshold must be a positive number at least 1")
      }
  
      if (specialMessageThreshold <= 0 || specialMessageThreshold <= minimumSavingsThreshold) {
        errors.push("Special message threshold must be a positive number and greater than minimum savings threshold")
      }
  
      // Parse start and end times
      const startDateTime = new Date(`1970-01-01T${startTime}:00`)
      const endDateTime = new Date(`1970-01-01T${endTime}:00`)
  
      if (startDateTime >= endDateTime) {
        errors.push("Start time must be before end time")
      }

          // Facebook Group/Page validation

      let hasValidLogin = false;

      for (const login of logins) {
        if (login.email && login.password) {
          hasValidLogin = true;
          break;
        }
      }

      if (!(fbPageId && accessToken) && !(fbGroupLink && hasValidLogin)) {
        errors.push("Please provide either a FB page ID with an access token or FB group link with at least one login.");
      }
  
      if (errors.length > 0) {
        return fail(400, {
          errorMessage: errors.join(". "),
          // You might want to return the form data here so the user doesn't lose their input
        })
      }
  
    const { error } = await supabase.from("user_settings").upsert({
      user_id: session.user.id,
      running_status: runningStatus,
      country: country,
      minimum_savings_threshold: minimumSavingsThreshold,
      cleanup_days_threshold: cleanupDaysThreshold,
      maximum_posts_per_session: maximumPostsPerSession,
      delay_between_posts: delayBetweenPosts,
      delay_between_sessions: delayBetweenSessions,
      recently_updated_hour_threshold: recentlyUpdatedHourThreshold,
      special_message_threshold: specialMessageThreshold,
      random_image_toggle: randomImageToggle,
      deeplink_toggle: deeplinkToggle,
      associate_tag: associateTag,
      start_time: startTime,
      end_time: endTime,
      fb_group_link: fbGroupLink,
      fb_page_id: fbPageId,
      logins: logins.length > 0 ? logins : null,
      access_token: accessToken,
      first_line_message: firstLineMessage,
      bottom_line_message: bottomLineMessage,
      updated_at: new Date(),
    })
  
    if (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
      })
    }
  
    return {
      runningStatus,
      country,
      minimumSavingsThreshold,
      cleanupDaysThreshold,
      maximumPostsPerSession,
      delayBetweenPosts,
      delayBetweenSessions,
      recentlyUpdatedHourThreshold,
      specialMessageThreshold,
      randomImageToggle,
      deeplinkToggle,
      associateTag,
      startTime,
      endTime,
      fbGroupLink,
      fbPageId,
      logins,
      accessToken,
      firstLineMessage,
      bottomLineMessage,
    }
  },
  updateEmail: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      throw redirect(303, "/login")
    }

    const formData = await request.formData()
    const email = formData.get("email") as string

    let validationError
    if (!email || email === "") {
      validationError = "An email address is required"
    }
    // Dead simple check -- there's no standard here (which is followed),
    // and lots of errors will be missed until we actually email to verify, so
    // just do that
    else if (!email.includes("@")) {
      validationError = "A valid email address is required"
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: ["email"],
        email,
      })
    }

    // Supabase does not change the email until the user verifies both
    // if 'Secure email change' is enabled in the Supabase dashboard
    const { error } = await supabase.auth.updateUser({ email: email })

    if (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        email,
      })
    }

    return {
      email,
    }
  },
  updatePassword: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      throw redirect(303, "/login")
    }

    const formData = await request.formData()
    const newPassword1 = formData.get("newPassword1") as string
    const newPassword2 = formData.get("newPassword2") as string
    const currentPassword = formData.get("currentPassword") as string

    // Can check if we're a "password recovery" session by checking session amr
    // let currentPassword take priority if provided (user can use either form)
    // @ts-expect-error: we ignore because Supabase does not maintain an AMR typedef
    const recoveryAmr = session.user?.amr?.find((x) => x.method === "recovery")
    const isRecoverySession = recoveryAmr && !currentPassword

    // if this is password recovery session, check timestamp of recovery session
    if (isRecoverySession) {
      const timeSinceLogin = Date.now() - recoveryAmr.timestamp * 1000
      if (timeSinceLogin > 1000 * 60 * 15) {
        // 15 mins in milliseconds
        return fail(400, {
          errorMessage:
            'Recovery code expired. Please log out, then use "Forgot Password" on the sign in page to reset your password. Codes are valid for 15 minutes.',
          errorFields: [],
          newPassword1,
          newPassword2,
          currentPassword: "",
        })
      }
    }

    let validationError
    const errorFields = []
    if (!newPassword1) {
      validationError = "You must type a new password"
      errorFields.push("newPassword1")
    }
    if (!newPassword2) {
      validationError = "You must type the new password twice"
      errorFields.push("newPassword2")
    }
    if (newPassword1.length < 6) {
      validationError = "The new password must be at least 6 charaters long"
      errorFields.push("newPassword1")
    }
    if (newPassword1.length > 72) {
      validationError = "The new password can be at most 72 charaters long"
      errorFields.push("newPassword1")
    }
    if (newPassword1 != newPassword2) {
      validationError = "The passwords don't match"
      errorFields.push("newPassword1")
      errorFields.push("newPassword2")
    }
    if (!currentPassword && !isRecoverySession) {
      validationError =
        "You must include your current password. If you forgot it, sign out then use 'forgot password' on the sign in page."
      errorFields.push("currentPassword")
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: [...new Set(errorFields)], // unique values
        newPassword1,
        newPassword2,
        currentPassword,
      })
    }

    // Check current password is correct before updating, but only if they didn't log in with "recover" link
    // Note: to make this truely enforced you need to contact supabase. See: https://www.reddit.com/r/Supabase/comments/12iw7o1/updating_password_in_supabase_seems_insecure/
    // However, having the UI accessible route still verify password is still helpful, and needed once you get the setting above enabled
    if (!isRecoverySession) {
      const { error } = await supabase.auth.signInWithPassword({
        email: session?.user.email || "",
        password: currentPassword,
      })
      if (error) {
        // The user was logged out because of bad password. Redirect to error page explaining.
        throw redirect(303, "/login/current_password_error")
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword1,
    })
    if (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        newPassword1,
        newPassword2,
        currentPassword,
      })
    }

    return {
      newPassword1,
      newPassword2,
      currentPassword,
    }
  },
  deleteAccount: async ({
    request,
    locals: { supabase, supabaseServiceRole, safeGetSession },
  }) => {
    const { session } = await safeGetSession()
    if (!session) {
      throw redirect(303, "/login")
    }

    const formData = await request.formData()
    const currentPassword = formData.get("currentPassword") as string

    if (!currentPassword) {
      return fail(400, {
        errorMessage:
          "You must provide your current password to delete your account. If you forgot it, sign out then use 'forgot password' on the sign in page.",
        errorFields: ["currentPassword"],
        currentPassword,
      })
    }

    // Check current password is correct before deleting account
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email: session?.user.email || "",
      password: currentPassword,
    })
    if (pwError) {
      // The user was logged out because of bad password. Redirect to error page explaining.
      throw redirect(303, "/login/current_password_error")
    }

    const { error } = await supabaseServiceRole.auth.admin.deleteUser(
      session.user.id,
    )
    if (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        currentPassword,
      })
    }

    await supabase.auth.signOut()
    throw redirect(303, "/")
  },
  updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      throw redirect(303, "/login")
    }

    const formData = await request.formData()
    const fullName = formData.get("fullName") as string

    let validationError
    const fieldMaxTextLength = 50
    const errorFields = []
    if (!fullName) {
      validationError = "Name is required"
      errorFields.push("fullName")
    } else if (fullName.length > fieldMaxTextLength) {
      validationError = `Name must be less than ${fieldMaxTextLength} characters`
      errorFields.push("fullName")
    }

    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields,
        fullName,
      })
    }

    const { error } = await supabase.from("profiles").upsert({
      id: session?.user.id,
      full_name: fullName,
      updated_at: new Date(),
    })

    if (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        fullName,
      })
    }

    return {
      fullName,
    }
  },
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (session) {
      await supabase.auth.signOut()
      throw redirect(303, "/")
    } else {
      throw redirect(303, "/")
    }
  },
}

<script lang="ts">
  import { onMount } from "svelte"
  import { getContext } from "svelte"
  import { enhance, applyAction } from "$app/forms"
  import { page } from "$app/stores"
  import type { Writable } from "svelte/store"
  import type { SubmitFunction } from "@sveltejs/kit"

  export let data
  let { userSettings } = data

  // Define the admin section context
  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("home")

  let example_values = {
    product_name: "15W MagSafe Car Mount Charger",
    percent_off_list_price: 21,
    clip_coupon_savings: 14,
    promo_code: "Q2FYBW7O",
    promo_code_percent_off: 10,
    final_savings_percent: 50,
    final_price: 27.99,
    image_link: "",
  }

  // Define the configuration settings
  let config = {
    running_status: false,
    country: "CA",
    minimum_savings_threshold: 0,
    cleanup_days_threshold: 0,
    maximum_posts_per_session: 0,
    delay_between_posts: 0,
    delay_between_sessions: 0,
    recently_updated_hour_threshold: 0,
    special_message_threshold: 0,
    random_image_toggle: false,
    deeplink_toggle: false,
    associate_tag: "",
    start_time: "",
    end_time: "",
    fb_group_link: "",
    fb_page_id: "",
    logins: [
      { email: "", password: "" },
      { email: "", password: "" },
      { email: "", password: "" },
    ],
    access_token: "",
    first_line_message: "",
    bottom_line_message: "",
    custom_template: "",
  }

  let initialConfig = JSON.parse(JSON.stringify(config)) // Store the initial

  onMount(() => {
    if (userSettings) {
      config.running_status = userSettings.running_status || false
      config.country = userSettings.country || "CA"
      config.minimum_savings_threshold =
        userSettings.minimum_savings_threshold || 0
      config.cleanup_days_threshold = userSettings.cleanup_days_threshold || 0
      config.maximum_posts_per_session =
        userSettings.maximum_posts_per_session || 0
      config.delay_between_posts = userSettings.delay_between_posts || 0
      config.delay_between_sessions = userSettings.delay_between_sessions || 0
      config.recently_updated_hour_threshold =
        userSettings.recently_updated_hour_threshold || 0
      config.special_message_threshold =
        userSettings.special_message_threshold || 0
      config.random_image_toggle = userSettings.random_image_toggle || false
      config.deeplink_toggle = userSettings.deeplink_toggle || false
      config.associate_tag = userSettings.associate_tag || ""
      config.start_time = userSettings.start_time || ""
      config.end_time = userSettings.end_time || ""
      config.fb_group_link = userSettings.fb_group_link || ""
      config.fb_page_id = userSettings.fb_page_id || ""
      config.logins =
        typeof userSettings.logins === "string"
          ? JSON.parse(userSettings.logins)
          : userSettings.logins || [
              { email: "", password: "" },
              { email: "", password: "" },
              { email: "", password: "" },
            ]
      config.access_token = userSettings.access_token || ""
      config.first_line_message = userSettings.first_line_message || ""
      config.bottom_line_message = userSettings.bottom_line_message || ""
      config.custom_template = userSettings.custom_template || ""

      initialConfig = JSON.parse(JSON.stringify(config)) // Store the initial config
    }
  })

  let loading = false
  let showPopup = false
  let copiedToClipboard = false

  // Handle form submission
  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
      if (result.type === "success") {
        initialConfig = { ...config } // Reset the initial config
        showPopup = true
        setTimeout(() => {
          showPopup = false
        }, 3000) // Hide the popup after 3 seconds
      }
    }
  }

  // Reactive statement to check if there are changes
  $: hasChanges = JSON.stringify(config) !== JSON.stringify(initialConfig)

  // Convert newlines to <br> for displaying in the preview
  const formatNewlines = (text: string) => {
    return text.replace(/\n/g, "<br>")
  }

  function populateTemplate(
    template: string,
    data: Record<string, any>,
  ): string {
    // Function to handle {if key}...{endif} blocks
    function processConditionals(template: string): string {
      const lines = template.split("\n")
      const processedLines = lines.map((line) => {
        // Find all conditionals in the line
        const conditionalRegex = /{if\s+(\w+)}(.*?){endif}/g
        let match
        let newLine = line
        let hasContent = false

        while ((match = conditionalRegex.exec(line)) !== null) {
          const [fullMatch, key, content] = match
          if (data[key]) {
            // Replace the conditional with its content
            newLine = newLine.replace(fullMatch, content.trim())
            hasContent = true
          } else {
            // Remove the entire conditional
            newLine = newLine.replace(fullMatch, "")
          }
        }

        // If the line had conditionals and is now empty, return null to remove it
        return line.includes("{if") && !hasContent ? null : newLine
      })

      // Filter out null lines and join the result
      return processedLines.filter((line) => line !== null).join("\n")
    }

    // First, process the {if ...}{endif} conditionals
    let processedTemplate = processConditionals(template)

    // Then, replace the remaining placeholders with the actual data or fallback
    processedTemplate = processedTemplate.replace(
      /{(\w+)}/g,
      (_, key) => (data[key] !== undefined ? data[key] : "N/A"), // Use fallback if key is missing
    )

    // Remove any triple (or more) newlines that might have been created
    processedTemplate = processedTemplate.replace(/\n{3,}/g, "\n\n")

    return processedTemplate.trim()
  }

  const availablePlaceholders = [
    {
      key: "product_name",
      description: 'The product name (e.g. "15W MagSafe Car Mount Charger")',
    },
    {
      key: "percent_off_list_price",
      description: "Percent off the list price (e.g. 21%)",
    },
    {
      key: "clip_coupon_savings",
      description: "Savings from clip coupons (e.g. $14)",
    },
    {
      key: "promo_code",
      description: 'Promo code for discounts (e.g. "Q2FYBW7O")',
    },
    {
      key: "promo_code_percent_off",
      description: "Percent off with promo code (e.g. 30%)",
    },
    {
      key: "final_savings_percent",
      description: "Final savings in percentage after all discounts (e.g. 50%)",
    },
    {
      key: "final_price",
      description: "Final price after all discounts (e.g. $27.99)",
    },
    {
      key: "image_link",
      description:
        "Only used as a conditional placeholder for image based posts (e.g. product name will show if image is available)",
    },
  ]

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(`{${text}}`)

    copiedToClipboard = true
    setTimeout(() => {
      copiedToClipboard = false
    }, 3000) // Hide the popup after 3 seconds
  }
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Configuration Settings</h1>

  <form
    method="POST"
    action="/account/api?/updateUserSettings"
    use:enhance={handleSubmit}
  >
    <!-- Running Status Section -->
    <div
      class="form-section mb-6 mt-6 p-6 border-2 border-primary rounded-lg bg-primary/10"
    >
      <h2 class="text-2xl font-bold text-primary mb-4 flex items-center">
        Running Status
      </h2>
      <div class="form-group">
        <p class="label-text text-lg mb-4">
          This is the main toggle to run and enable the automated posting. After
          toggling on and pressing save, wait for 5 minutes. Refresh to see if
          any deals are posted on your Facebook group or page. If you refresh
          and notice the running status turns off, an error may have occurred.
          Please double-check your configuration or <a
            href="/contact_us"
            class="link text-primary font-semibold">contact support</a
          >.
        </p>

        <p class="label-text text-md mb-4">
          Note: In order for changes to appear you need to stop and restart the
          program
        </p>

        <div class="flex items-center">
          <label class="label text-lg font-semibold mr-4" for="running_status"
            >Running Status:</label
          >
          <input
            type="checkbox"
            class="toggle toggle-success toggle-lg"
            bind:checked={config.running_status}
            name="runningStatus"
            id="running_status"
          />
        </div>
      </div>
    </div>

    <!-- Country Selection Section -->
    <div class="form-section mb-6">
      <h2 class="text-xl font-semibold">Select Country</h2>
      <div class="form-group">
        <label class="label" for="country">
          <span class="label-text">Country</span>
        </label>
        <select
          class="select select-bordered w-full"
          name="country"
          id="country"
          bind:value={config.country}
        >
          <option value="CA">Canada</option>
          <option value="US" disabled>United States (Coming Soon!)</option>
        </select>
      </div>
    </div>

    <!-- Save Button is disabled if there are no changes -->
    <button
      type="submit"
      class="ml-auto btn btn-lg mt-3 px-8 py-3 min-w-[180px] btn-success font-bold shadow-lg hover:shadow-2xl transition-all duration-200 ease-in-out"
      disabled={loading || !hasChanges}
    >
      {#if loading}
        <span class="loading loading-spinner loading-md align-middle mx-3"
        ></span>
      {:else}
        Save Changes
      {/if}
    </button>

    <!-- Thresholds Section -->
    <div
      class="tab-content form-section grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-6"
    >
      <h2 class="col-span-1 md:col-span-2 text-xl font-semibold">
        Posting Preferences
      </h2>

      <div class="form-group">
        <label class="label" for="minimum-savings-threshold">
          <span class="label-text">Minimum Savings Requirement</span>
        </label>
        <input
          type="number"
          class="input input-bordered w-full"
          bind:value={config.minimum_savings_threshold}
          name="minimumSavingsThreshold"
          id="minimum-savings-threshold"
        />
      </div>

      <div class="form-group">
        <label class="label" for="cleanup-days-threshold">
          <span class="label-text">Repost Interval (Days):</span>
        </label>
        <input
          type="number"
          class="input input-bordered w-full"
          bind:value={config.cleanup_days_threshold}
          name="cleanupDaysThreshold"
          id="cleanup-days-threshold"
        />
      </div>

      <div class="form-group">
        <label class="label" for="maximum-posts-per-session">
          <span class="label-text">Maximum Posts Per Session</span>
        </label>
        <input
          type="number"
          class="input input-bordered w-full"
          bind:value={config.maximum_posts_per_session}
          name="maximumPostsPerSession"
          id="maximum-posts-per-session"
        />
      </div>

      <div class="form-group">
        <label class="label" for="delay-between-posts">
          <span class="label-text">Time Between Posts (Seconds)</span>
        </label>
        <input
          type="number"
          class="input input-bordered w-full"
          bind:value={config.delay_between_posts}
          name="delayBetweenPosts"
          id="delay-between-posts"
        />
      </div>

      <div class="form-group">
        <label class="label" for="delay-between-sessions">
          <span class="label-text">Session Interval (Seconds):</span>
        </label>
        <input
          type="number"
          class="input input-bordered w-full"
          bind:value={config.delay_between_sessions}
          name="delayBetweenSessions"
          id="delay-between-sessions"
        />
      </div>

      <div class="form-group">
        <label class="label" for="recently-updated-hour-threshold">
          <span class="label-text">Recent Update Window (Hours):</span>
        </label>
        <input
          type="number"
          class="input input-bordered w-full"
          bind:value={config.recently_updated_hour_threshold}
          name="recentlyUpdatedHourThreshold"
          id="recently-updated-hour-threshold"
        />
      </div>

      <div class="form-group">
        <label class="label" for="special-message-threshold">
          <span class="label-text">Special Message Requirement</span>
        </label>
        <input
          type="number"
          class="input input-bordered w-full"
          bind:value={config.special_message_threshold}
          name="specialMessageThreshold"
          id="special-message-threshold"
        />
      </div>
    </div>

    <!-- Toggles -->
    <div class="form-section mb-6">
      <h2 class="text-xl font-semibold">Toggles</h2>
      <div class="form-group">
        <label class="label" for="random_image_toggle"
          ><span class="label-text">Random Image Toggle</span></label
        >
        <input
          type="checkbox"
          class="toggle toggle-success"
          bind:checked={config.random_image_toggle}
          name="randomImageToggle"
          id="random_image_toggle"
        />
      </div>

      <!-- Deeplink Toggle -->
      <div class="form-group mt-4">
        <label class="label" for="deeplink_toggle">
          <span class="label-text">Enable Deeplinks (Experimental)</span>
        </label>
        <input
          type="checkbox"
          class="toggle toggle-success"
          bind:checked={config.deeplink_toggle}
          name="deeplinkToggle"
          id="deeplink_toggle"
        />
        <p class="text-md mt-2 text-gray-600 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          This feature is experimental. If the deeplink service is not working correctly,
          it will default to normal links.
        </p>
      </div>
    </div>

    <!-- Amazon Affiliate Settings -->
    <div class="form-section mb-6">
      <h2 class="text-xl font-semibold">Amazon Affiliate Settings</h2>
      <div class="form-group">
        <label class="label" for="associate_tag"
          ><span class="label-text">Associate Tag</span></label
        >
        <input
          type="text"
          class="input input-bordered w-full"
          bind:value={config.associate_tag}
          name="associateTag"
          placeholder="Enter your Amazon associate tag"
        />
      </div>
    </div>

    <!-- Posting Schedule -->
    <div class="form-section mb-6">
      <h2 class="text-xl font-semibold">Posting Schedule</h2>
      <p class="text-gray-600 mb-4">Note: This is based off CDT Timezone</p>
      <div class="form-group max-w-[16rem]">
        <div>
          <label for="start-time" class="block mb-2 text-sm font-medium"
            >Start time:</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="time"
              id="start-time"
              class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              bind:value={config.start_time}
              name="startTime"
              required
            />
          </div>
        </div>
        <div>
          <label for="end-time" class="block mt-2 mb-2 text-sm font-medium"
            >End time:</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="time"
              id="end-time"
              class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              bind:value={config.end_time}
              name="endTime"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Facebook Page Integration Section -->
    <div class="form-section mb-6">
      <h2 class="text-xl font-semibold">Facebook Page Integration</h2>
      <div class="form-group">
        <label class="label" for="fb_page_id"
          ><span class="label-text">Facebook Page ID</span></label
        >
        <input
          type="text"
          class="input input-bordered w-full"
          bind:value={config.fb_page_id}
          name="fbPageId"
          id="fb_page_id"
          placeholder="Enter your Facebook page ID"
        />
      </div>
      <div class="form-group">
        <label class="label" for="access_token">
          <span class="label-text">Access Token</span></label
        >
        <input
          type="text"
          class="input input-bordered w-full"
          bind:value={config.access_token}
          name="accessToken"
          id="access_token"
          placeholder="Enter your access token"
        />
      </div>
    </div>

    <!-- Facebook Group Integration Section -->
    <div class="form-section mb-6">
      <h2 class="text-xl font-semibold">Facebook Group Integration</h2>
      <div class="form-group">
        <label class="label" for="fb_group_link"
          ><span class="label-text">Facebook Group Link</span></label
        >
        <input
          type="text"
          class="input input-bordered w-full"
          bind:value={config.fb_group_link}
          name="fbGroupLink"
          id="fb_group_link"
          placeholder="Enter your Facebook group link"
        />
      </div>
    </div>

    <!-- Facebook Logins Section -->
    <div class="form-section mb-6">
      <p class="text-gray-600 mb-4">
        Enter your Facebook login details below. These will be used randomly to
        post in your Facebook group. You can add up to 3 logins. Please ensure
        that they are members of your Facebook group, and that they have posting
        privileges.
      </p>

      <div class="alert alert-error max-w-lg mt-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          /></svg
        >
        <div>
          <div class="font-bold">Important</div>
          <div class="my-2">
            Please ensure that the provided logins have Two-Factor
            Authentication (2FA) disabled for proper functionality.
          </div>
        </div>
      </div>

      {#each config.logins as login, index}
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Login {index + 1}</h3>
          <div class="form-group">
            <label class="label" for="email">
              <!-- <span class="label-text">Email</span> -->
            </label>
            <input
              type="email"
              class="input input-bordered w-full"
              bind:value={login.email}
              name={`logins[${index}].email`}
              placeholder="Enter your email"
            />
          </div>
          <div class="form-group">
            <label class="label" for="password">
              <!-- <span class="label-text">Password</span> -->
            </label>
            <input
              type="password"
              class="input input-bordered w-full"
              bind:value={login.password}
              name={`logins[${index}].password`}
              placeholder="Enter your password"
            />
          </div>
        </div>
      {/each}
    </div>

    <!-- Customize Your Post -->
    <div class="form-section mb-6">
      <h2 class="text-xl font-semibold">Customize Your Post</h2>
      <div class="flex flex-col md:flex-row gap-6">
        <div class="mt-4 md:w-1/2">
          <div class="form-group mb-4">
            <textarea
              id="custom_template"
              name="customTemplate"
              bind:value={config.custom_template}
              class="textarea textarea-bordered w-full h-80"
              placeholder="Enter your custom template here"
            ></textarea>
          </div>
        </div>

        <!-- Available Placeholders (Right side, responsive grid) -->
        <div class="md:w-1/2">
          <h3 class="text-lg font-semibold mb-2">Available Placeholders:</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            {#each availablePlaceholders as placeholder}
              <div
                class="tooltip tooltip-bottom"
                data-tip={placeholder.description}
              >
                <button
                  class="btn btn-outline btn-primary w-full"
                  on:click={() => copyToClipboard(placeholder.key)}
                >
                  {placeholder.key}
                </button>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Facebook Post Preview -->
      <div
        class="flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0 lg:space-x-6"
      >
        <!-- Facebook Post Preview with Preview Link -->
        <div class="flex-1">
          <h2 class="text-xl font-semibold">
            Facebook Post Preview with Preview Link
          </h2>
          <div class="bg-grey rounded-lg shadow-2xl pt-0.5 mt-4 bg-white">
            <!-- Post Header: Avatar, Username, Timestamp -->
            <div class="flex items-center m-6">
              <img
                src="/images/favicon.png"
                alt="User Avatar"
                class="rounded-full w-12 h-12 mr-3"
              />
              <div>
                <p class="font-semibold">Deal Dynamo</p>
                <p class="text-gray-500 text-sm">Just now</p>
              </div>
            </div>

            <!-- Custom Template Preview -->
            <p class="text-lg m-6">
              {@html formatNewlines(
                populateTemplate(config.custom_template, example_values),
              )}
            </p>

            <!-- Link Preview -->
            <div class="link-preview w-full bg-gray-700">
              <img
                src="https://placehold.co/600x400"
                alt=""
                class="w-full h-auto"
              />
              <div class="p-4">
                <p class="text-sm text-white">AMAZON.CA</p>
                <p class="text-lg text-white font-bold">
                  {example_values.product_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Facebook Post Preview with Image -->
        <div class="flex-1">
          <h2 class="text-xl font-semibold">
            Facebook Post Preview with Image
          </h2>
          <div class="bg-grey rounded-lg shadow-2xl pt-0.5 mt-4 bg-white">
            <!-- Post Header: Avatar, Username, Timestamp -->
            <div class="flex items-center m-6">
              <img
                src="/images/favicon.png"
                alt="User Avatar"
                class="rounded-full w-12 h-12 mr-3"
              />
              <div>
                <p class="font-semibold">Deal Dynamo</p>
                <p class="text-gray-500 text-sm">Just now</p>
              </div>
            </div>

            <!-- Custom Template Preview -->
            <p class="text-lg m-6">
              {@html formatNewlines(
                populateTemplate(config.custom_template, {
                  ...example_values,
                  image_link: "https://placehold.co/600x400",
                }),
              )}
            </p>

            <!-- Image Preview -->
            <div class="link-preview w-full bg-gray-700">
              <img
                src="https://placehold.co/600x400"
                alt=""
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {#if $page?.form?.errorMessage}
        <div class="toast toast-top">
          <div class="alert alert-error text-wrap self-end">
            <span>{$page?.form?.errorMessage}</span>
          </div>
        </div>
      {/if}

      {#if showPopup}
        <div class="toast toast-top">
          <div class="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Changes saved successfully!</span>
          </div>
        </div>
      {/if}

      {#if copiedToClipboard}
        <div class="toast toast-top">
          <div class="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Placeholder copied to clipboard!</span>
          </div>
        </div>
      {/if}
    </div>
  </form>
</div>

<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { ToolTipMessages } from "../../../../../config"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("setup_guide")

  // Get extended access token
  let pageId = ""
  let extendedToken = ""

  function generateNeverExpiringToken() {
    // Check if both fields are not empty
    if (pageId.trim() === "" || extendedToken.trim() === "") {
      alert("Please enter both Page ID and Extended Token.")
      return // Stop further execution
    }

    // Construct the long-lived token URL
    const longLivedTokenUrl = `https://graph.facebook.com/${pageId}?fields=access_token&access_token=${extendedToken}`

    // Open the long-lived token URL in a new tab
    window.open(longLivedTokenUrl, "_blank")
  }
</script>

<svelte:head>
  <title>Setup Guide</title>
</svelte:head>

<div class="container mx-auto my-8 px-4">
  <div class="prose lg:prose-xl mx-auto">
    <div class="alert alert-error shadow-lg mb-6">
      <div>
        <strong>Warning:</strong> Unauthorized use of your account or creating more
        than 1 account will result in permanent termination of your account.
      </div>
    </div>

    <h1 id="amazon-deals-posting-bot">Setup Guide</h1>
    <p>
      Welcome to Deal Dynamo! This application helps you automate the posting of
      Amazon deals to a Facebook group and page. Below are the instructions to
      set up the application.
    </p>

    <h2 id="thresholds">Thresholds:</h2>
    <ul>
      <li>
        <code>Minimum Savings Threshold</code>: {ToolTipMessages.minimum_savings_threshold}
      </li>
      <li>
        <code>Cleanup Days Threshold</code>: {ToolTipMessages.cleanup_days_threshold}
      </li>
      <li>
        <code>Maximum Posts Per Session</code>: {ToolTipMessages.maximum_posts_per_session}
      </li>
      <li>
        <code>Delay Between Posts</code>: {ToolTipMessages.delay_between_posts}
      </li>
      <li>
        <code>Delay Between Sessions</code>: {ToolTipMessages.delay_between_sessions}
      </li>
      <li>
        <code>Recently Updated Hour Threshold</code>: {ToolTipMessages.recently_updated_hour_threshold}
      </li>
      <li>
        <code>Special Message Threshold</code>: {ToolTipMessages.special_message_threshold}
      </li>
    </ul>

    <h2 id="toggles">Toggles:</h2>
    <ul>
      <li>
        <code>Random Image Toggle</code>: If the toggle is turned on, each post
        will randomly alternate between having an image with a clickable link
        and having no image but still having a clickable link. If the toggle is
        turned off, posts will just have a clickable link.
      </li>
    </ul>

    <h2 id="amazon-affiliate-settings">Amazon Affiliate Settings:</h2>
    <ul>
      <li><code>Amazon Associate Tag</code>: Your Amazon Associate Tag.</li>
    </ul>

    <h2 id="posting-schedule">Posting Schedule:</h2>
    <ul>
      <li>
        <code>Start Time</code>: Start time for posting deals (format: "HH:MM").
      </li>
      <li>
        <code>End Time</code>: End time for posting deals (format: "HH:MM").
      </li>
    </ul>

    <h2 id="facebook-integration">Facebook Integration:</h2>
    <ul>
      <li>
        <code>Facebook Group Link</code>: Link to the Facebook group where deals
        will be posted.
      </li>
      <li>
        <code>Logins</code>: These logins will be randomized and used to post in
        your Facebook group.
        <ul>
          <li>
            You can add up to 3 different <code>emails</code> and
            <code>passwords</code> for logging in to Facebook.
          </li>
        </ul>
      </li>
      <li><code>Facebook Page ID</code>: ID of your Facebook page.</li>
      <li>
        <code>Access Token</code>: Your Facebook page access token. Allows
        posting to your Facebook page
      </li>
    </ul>

    <h1 id="integrating-facebook-page-posting">
      Integrating Facebook Page Posting
    </h1>
    <p>
      In order to post to your Facebook page, you will need an access token and
      your page ID. Follow the steps below:
    </p>

    <h1 id="how-to-find-your-page-id">How to find your page ID</h1>
    <ol>
      <li>
        Go to <a href="https://business.facebook.com/latest/home"
          >https://business.facebook.com/latest/home</a
        >
        and make sure you are on your Facebook page.
      </li>
      <li>Once the page loads, you will notice the URL contains asset_id=</li>
      <li>
        Copy that ID number into your config settings under <code
          >FB_PAGE_ID</code
        >
      </li>
    </ol>

    <h2 id="opening-a-developer-account">Opening a Developer account</h2>
    <ol>
      <li>
        Go to <a href="https://developers.facebook.com/apps"
          >https://developers.facebook.com/apps</a
        >
      </li>
      <li>Click on Create App, click Other, then Business.</li>
      <li>Add an app name and click next.</li>
      <li>
        Then navigate to <a
          href="https://developers.facebook.com/tools/explorer/"
          >https://developers.facebook.com/tools/explorer/</a
        >
        and under Meta App select your app.
      </li>
      <li>
        After selecting the permissions, click on "Get Token" and choose "Get
        Page Access Token." from the dropdown menu. You will be prompted to
        connect and link it to your group.
      </li>
      <li>
        Afterwards, click on User Token and you will click the name of the group
        in the dropdown menu.
      </li>
      <li>
        Search and add the required permissions for your access token. For our
        purposes, you'll need at least:
      </li>
    </ol>
    <ul>
      <li>pages_manage_posts</li>
      <li>pages_manage_engagement</li>
      <li>pages_read_engagement</li>
      <li>pages_read_user_engagement</li>
      <li>pages_read_user_content</li>
    </ul>
    <ol start="8">
      <li>
        Click on "Generate Access Token." Follow the authentication and linking.
        The permissions should turn from green to grey.
      </li>
      <li>
        Copy the generated access token and follow the steps below to generate a
        token that doesn't expire.
      </li>
    </ol>
    <p>
      If you need more help, follow the video steps from 1:20 to 7:16 and copy
      the token generated.<br />
      [<a href="https://www.youtube.com/watch?v=s8c2SMpWDOo"
        >https://www.youtube.com/watch?v=s8c2SMpWDOo</a
      >]
    </p>

    <h2 id="generating-a-never-expiring-facebook-token">
      Generating a never expiring Facebook token
    </h2>
    <p>
      Once you have your short-lived token you need to make it so it doesn't
      expire. Here is how to do that:
    </p>
    <ol>
      <li>
        Go to <a
          href="https://developers.facebook.com/tools/debug/accesstoken/"
          target="_blank"
          >https://developers.facebook.com/tools/debug/accesstoken/</a
        >
      </li>
      <li>Input your short-lived token.</li>
      <li>
        Click <code>Extend Access Token</code> at the bottom of the page; a new extended
        token should generate.
      </li>
      <li>
        Copy that extended token and paste it in the below form with your page
        ID, and get your never-expiring token.
      </li>
      <div class="form-control">
        <label for="pageId" class="label">
          <span class="label-text">Page ID:</span>
        </label>
        <input
          type="text"
          id="pageId"
          name="pageId"
          placeholder="Enter your page ID"
          class="input input-bordered"
          bind:value={pageId}
        />
      </div>
      <div class="form-control mt-4">
        <label for="extended_token" class="label">
          <span class="label-text">Extended Token:</span>
        </label>
        <input
          type="text"
          id="extended_token"
          name="extendedToken"
          placeholder="Enter your extended token"
          class="input input-bordered"
          bind:value={extendedToken}
        />
      </div>
      <button
        class="btn btn-primary mt-4"
        on:click={generateNeverExpiringToken}
      >
        Generate Never Expiring Token
      </button>
      <li>
        You will be greeted with a page that contains your new access token that
        does not expire. Copy that into the <code>ACCESS_TOKEN</code> section.
      </li>
      <li>
        You can check that token in <a
          href="https://developers.facebook.com/tools/debug/accesstoken/"
          target="_blank">access token debugger tool</a
        > again and verify that the Expires field will show never.
      </li>
    </ol>

    <h2 id="running-the-application">
      Want to see how well your posts are doing?
    </h2>
    <p>
      In your Amazon associates account, go to <a
        href="https://associates.amazon.ca/home/account/tag/manage"
        target="_blank">Manage your Tracking ID's</a
      >
      and add a new tracking ID that you want to link with your automated posts.
      You can then view the performance of your posts by going to the
      <a
        href="https://associates.amazon.ca/p/reporting/earnings"
        target="_blank">Earnings Report Page</a
      > in your associates account and filter by the tracking ID you added.
    </p>

    <h2 id="running-the-application">
      Ensuring your posts are viewable by others
    </h2>
    <p>
      On your app in the developers page click 'App settings' then 'Basic'. You
      will see a text box to enter a Privacy Policy URL. You can copy this link
      and paste it in the box:
      <a
        href="https://www.termsfeed.com/live/80c0ffb5-e894-4477-9a9d-ac6e2148e476"
        target="_blank">Privacy Policy</a
      >. After that, you will see a toggle called 'App Mode: Development' in the
      upper header bar of the page. You can then toggle it to live mode. Double
      check from a friends account that they are able to see your posts.
    </p>
    <h2 id="running-the-application">Running the Application</h2>
    <p>
      After completing the setup steps and entering your information in the
      profile tab, you can toggle the running status and the application will
      start for you. It may take a few minutes for it to begin posting, so
      please be patient. Happy Posting!
    </p>
  </div>
</div>

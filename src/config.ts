export const WebsiteName: string = "Deal Dynamo"
export const WebsiteBaseUrl: string = "https://deal-dynamo.vercel.app/"
export const WebsiteDescription: string =
  "Automate the latest Amazon deals to your Facebook page or group."
export const ToolTipMessages = {
    minimum_savings_threshold: "Minimum savings percentage for a deal to be considered for posting. For example, if set to 30%, only deals with a savings percentage of 30% or higher will be posted.",
    cleanup_days_threshold: "Number of days after which a previously posted deal can be reposted if it still exists. For example, if set to 5 days, a deal posted 5 days ago can be posted again.",
    maximum_posts_per_session: "Maximum number of deals that can be posted in a single session.",
    delay_between_posts: "Time delay between consecutive Facebook posts.",
    delay_between_sessions: "Time gap between each session of posting.",
    recently_updated_hour_threshold: "The number of hours within which a product is considered recently updated. Keeping this at 5 is recommended for best results. Ex. if you set this to 5, then the program will search for all deals posted within 5 hours.",
    special_message_threshold: "The savings percentage value for adding a special message to high-value deals. Ex. if you set this to 70, then if a deal has a savings percentage of 70% or higher, it will be posted with a special message.",
};

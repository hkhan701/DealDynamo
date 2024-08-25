export const WebsiteName: string = "Deal Dynamo"
export const WebsiteBaseUrl: string = "https://deal-dynamo.vercel.app/"
export const WebsiteDescription: string =
  "Automate your Amazon deals to your Facebook page or group."
export const ToolTipMessages = {
    minimum_savings_threshold: "Minimum savings percentage for a deal to be considered for posting. Ex. if you set this to 30, then if a deal has a savings percentage of 30% or higher, it will be posted.",
    cleanup_days_threshold: "Number of days after which deals are removed from products you have already posted. Ex. if you set this to 5, then if a product was posted older than 5 days ago, it can be posted again.",
    maximum_posts_per_session: "This is the maximum number of posts that can be made within a single session.",
    delay_between_posts: "This is the delay (in seconds) between each facebook post.",
    delay_between_sessions: "This is the time gap (in seconds) between each session of posting.",
    recently_updated_hour_threshold: "The number of hours within which a product is considered recently updated. Keeping this at 5 is recommended for best results. Ex. if you set this to 5, then the program will search for all deals posted within 5 hours.",
    special_message_threshold: "The savings percentage value for adding a special message to high-value deals. Ex. if you set this to 70, then if a deal has a savings percentage of 70% or higher, it will be posted with a special message.",
};

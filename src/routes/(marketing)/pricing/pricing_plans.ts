export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "Get started with our basic plan at no cost!",
    price: "$0",
    priceIntervalName: "per month",
    stripe_price_id: null,
    features: [
      "24/7 Deal Scraping",
      "Facebook Group & Pages Capabilities",
      "3 Facebook Logins",
      "Custom Image & Link Posts",
      "Deal Scheduling",
      "Your Affiliate Link in 70% of Posts"
    ],
  },
  // {
  //   id: "pro",
  //   name: "Pro",
  //   description:
  //     "A plan to test the purchase experience. Try buying this with the test credit card 4242424242424242.",
  //   price: "$5",
  //   priceIntervalName: "per month",
  //   stripe_price_id: "price_1NkdZCHMjzZ8mGZnRSjUm4yA",
  //   stripe_product_id: "prod_OXj1CcemGMWOlU",
  //   features: [
  //     "Everything in Free",
  //     "Support us with fake money",
  //     "Test the purchase experience",
  //   ],
  // },
  // {
  //   id: "enterprise",
  //   name: "Enterprise",
  //   description:
  //     "A plan to test the upgrade expereince. Try buying this with the test credit card 4242424242424242.",
  //   price: "$15",
  //   priceIntervalName: "per month",
  //   stripe_price_id: "price_1Nkda2HMjzZ8mGZn4sKvbDAV",
  //   stripe_product_id: "prod_OXj20YNpHYOXi7",
  //   features: [
  //     "Everything in Pro",
  //     "Try the 'upgrade plan' UX",
  //     "Still actually free!",
  //   ],
  // },
]

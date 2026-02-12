import Stripe from "stripe";

let _stripe: Stripe | null = null;
let _stripeKey: string | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Please define the STRIPE_SECRET_KEY environment variable");
  }

  if (!_stripe || _stripeKey !== key) {
    _stripeKey = key;
    _stripe = new Stripe(key, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return _stripe;
}

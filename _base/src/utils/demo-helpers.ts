// This helper function is used to determine if the app is running in demo mode which we deploy at baas.stripe.dev
// To make it easier for you transition to a real production app, we've made it so that you can delete this code, all
// references to it, and logic guarded by it and the app will still work. The only thing that will change is that your
// app will start to behave like a real production app. For example, the Stripe Connect Onboarding forms will require
// filling out by your users.
export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
};

export const generateDemoEmail = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const alphanumericPart = Array.from(
    { length: 6 },
    () => characters[Math.floor(Math.random() * characters.length)],
  ).join("");

  return `demo-user-${alphanumericPart}@stripe.dev`;
};

export const TOS_ACCEPTANCE = { date: 1691518261, ip: "127.0.0.1" };

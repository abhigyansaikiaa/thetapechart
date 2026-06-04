/**
 * Source of truth for checking if Clerk is configured with active keys.
 * If not, the application runs in Mock/Offline mode.
 */
export const isClerkEnabled = (): boolean => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secret = process.env.CLERK_SECRET_KEY;
  
  return (
    !!key && 
    !key.includes("placeholder") && 
    !key.includes("YWxwaGFlZGdl") &&
    !!secret &&
    !secret.includes("placeholder") && 
    !secret.includes("YWxwaGFlZGdl")
  );
};

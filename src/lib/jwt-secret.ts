const INSECURE_DEFAULT = "your-secret-key-change-in-production";

/**
 * Returns the JWT signing secret. In production a strong JWT_SECRET is required.
 */
export function getJwtSecret(): Uint8Array {
  const secret = (process.env.JWT_SECRET || "").trim();

  if (!secret || secret === INSECURE_DEFAULT) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "JWT_SECRET is missing or insecure. Set a strong random JWT_SECRET (32+ chars) in Vercel env."
      );
    }
    console.warn(
      "[security] Using insecure default JWT_SECRET. Set JWT_SECRET before deploying."
    );
    return new TextEncoder().encode(INSECURE_DEFAULT);
  }

  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production.");
  }

  return new TextEncoder().encode(secret);
}

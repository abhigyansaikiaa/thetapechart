import { headers } from "next/headers";
import { Redis } from "@upstash/redis";

const isUpstashConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = isUpstashConfigured ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
}) : null;

/**
 * Creates a unique fingerprint for a device based on its IP and User-Agent
 */
export function getDeviceFingerprint(): string {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown_ip";
  const userAgent = headersList.get("user-agent") ?? "unknown_agent";
  
  // A simple but effective fingerprint for this use case
  return Buffer.from(`${ip}-${userAgent}`).toString("base64");
}

/**
 * Validates if the current device matches the user's locked device.
 * Returns { locked: boolean, valid: boolean }
 */
export async function validateDeviceLock(userId: string): Promise<{ isLocked: boolean, isValid: boolean }> {
  if (!redis || !userId) return { isLocked: false, isValid: true };

  const currentFingerprint = getDeviceFingerprint();
  const redisKey = `device_lock_${userId}`;

  try {
    const lockedFingerprint = await redis.get<string>(redisKey);

    if (!lockedFingerprint) {
      // First time login for this user, lock it to this device
      // We set expiration to 30 days (2592000 seconds)
      await redis.setex(redisKey, 2592000, currentFingerprint);
      return { isLocked: true, isValid: true };
    }

    // Compare fingerprints
    if (lockedFingerprint !== currentFingerprint) {
      return { isLocked: true, isValid: false }; // Mismatch!
    }

    return { isLocked: true, isValid: true };
  } catch (error) {
    console.error("Device locking error:", error);
    return { isLocked: false, isValid: true };
  }
}

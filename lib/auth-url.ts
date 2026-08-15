const LOCAL_AUTH_ORIGIN = "http://localhost:3001";

function parseOrigin(value: string | undefined) {
  const normalized = value
    ?.trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^BETTER_AUTH_URL\s*=\s*/i, "");
  if (!normalized) return null;

  try {
    const url = new URL(
      normalized.startsWith("http://") || normalized.startsWith("https://")
        ? normalized
        : `https://${normalized}`,
    );

    return url.origin;
  } catch {
    return null;
  }
}

export function getServerAuthOrigin() {
  return (
    parseOrigin(process.env.BETTER_AUTH_URL) ??
    parseOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    parseOrigin(process.env.VERCEL_URL) ??
    LOCAL_AUTH_ORIGIN
  );
}

export function getClientAuthOrigin() {
  return typeof window === "undefined" ? LOCAL_AUTH_ORIGIN : window.location.origin;
}

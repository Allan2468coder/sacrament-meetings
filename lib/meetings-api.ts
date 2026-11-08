import { headers } from "next/headers";

export async function fetchMeetingsApi(path: string): Promise<Response> {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  )
    ?.split(",")[0]
    .trim();

  if (!host) {
    throw new Error("Unable to determine the request host for the meetings API.");
  }

  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  const isLocalHost =
    host.startsWith("localhost") ||
    host.startsWith("127.") ||
    host.startsWith("[::1]");
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : isLocalHost
        ? "http"
        : "https";

  const cookie = requestHeaders.get("cookie");

  return fetch(new URL(path, `${protocol}://${host}`), {
    ...(cookie ? { headers: { cookie } } : {}),
    cache: "no-store",
  });
}

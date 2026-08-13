import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const authResponse = await auth.api.signOut({
    headers: await headers(),
    asResponse: true,
  });
  const responseHeaders = new Headers(authResponse.headers);
  responseHeaders.set("Location", new URL("/", request.url).toString());

  return new Response(null, {
    status: 303,
    headers: responseHeaders,
  });
}

import { NextResponse, type NextRequest } from "next/server";
import { createEnquiryHandler } from "@/lib/enquiry-handler";
import { createRateLimiter, createSeenStore } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Module-level singletons (per server instance). See rate-limit.ts for limits of this approach.
const handler = createEnquiryHandler({
  env: process.env,
  rateLimiter: createRateLimiter({ limit: 6, windowMs: 10 * 60 * 1000 }),
  seen: createSeenStore<string>({ ttlMs: 30 * 60 * 1000 }),
});

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  const contentLength = request.headers.get("content-length");
  const result = await handler({
    contentType: request.headers.get("content-type"),
    contentLength: contentLength ? Number.parseInt(contentLength, 10) : null,
    ip: clientIp(request),
    readBody: () => request.text(),
  });

  const response = NextResponse.json(result.body, {
    status: result.status,
    headers: { "Cache-Control": "no-store", ...result.headers },
  });

  if (result.body.ok) {
    // Short-lived, HttpOnly marker so /thank-you only renders after a server-accepted enquiry.
    response.cookies.set("rm_lead_ref", result.body.reference, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
    });
  }
  return response;
}

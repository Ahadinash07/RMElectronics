import { NextResponse, type NextRequest } from "next/server";
import { createRateLimiter, createSeenStore } from "@/lib/rate-limit";
import { createReviewHandler } from "@/lib/review-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = createReviewHandler({
  env: process.env,
  rateLimiter: createRateLimiter({ limit: 4, windowMs: 30 * 60 * 1000 }),
  seen: createSeenStore<string>({ ttlMs: 60 * 60 * 1000 }),
});

function clientIp(request: NextRequest): string {
  const first = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
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
  return NextResponse.json(result.body, {
    status: result.status,
    headers: { "Cache-Control": "no-store", ...result.headers },
  });
}

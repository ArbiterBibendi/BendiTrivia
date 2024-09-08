import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});
export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    const { success, remaining } = await ratelimit.limit("api");
    if (!success) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }
  }
}

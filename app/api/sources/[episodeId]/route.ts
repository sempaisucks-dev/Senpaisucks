import { NextResponse } from "next/server";
import { redis } from "../../../../lib/cache/index";
import { RATE_LIMIT_IP_PATTERN } from "../../../../lib/cache/keys";

export async function GET(request: Request, { params }: { params: { episodeId: string } }) {
  const episodeId = params.episodeId;

  const forwardFor = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const ip = forwardFor.split(",")[0].trim();

  if (!ip) return NextResponse.json({ error: "Cannot determine IP" }, { status: 400 });

  const rateKey = RATE_LIMIT_IP_PATTERN.replace("{ip}", ip);

  try {
    const count = await redis.incr(rateKey);
    if (count === 1) {
      // set expiry 60 seconds
      await redis.expire(rateKey, 60);
    }
    if (count > 30) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  } catch (err) {
    // if Redis fails, continue but log
    console.error("Rate limit check failed", err);
  }

  const upstream = process.env.PRIVATE_SOURCES_URL;
  if (!upstream) {
    return NextResponse.json({ error: "PRIVATE_SOURCES_URL not configured" }, { status: 500 });
  }

  const url = `${upstream.replace(/\/$/, "")}/episodes/${encodeURIComponent(episodeId)}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }

  const data = await res.json();

  // Expect upstream to return { streamUrl: string }
  return NextResponse.json({ streamUrl: data.streamUrl });
}

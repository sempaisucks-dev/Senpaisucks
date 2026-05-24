import { NextResponse } from "next/server";

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const body = `User-agent: *\nDisallow: /api/\nDisallow: /user/\nDisallow: /admin/\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

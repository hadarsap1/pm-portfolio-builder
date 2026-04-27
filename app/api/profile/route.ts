import { type NextRequest, NextResponse } from "next/server";
import { decodeSharePayload } from "@/lib/share/payload";

// Same edge-CPU concerns as /share/og-card — every URL crawler will hit
// this if it's discovered. Keep the guard tight.
const MAX_PAYLOAD_LENGTH = 20_000;

export const dynamic = "force-dynamic";

// HTTP header values are ByteString (Latin-1) — no emoji. Saved for the body.
const HELLO_HEADER = "hello, fellow developer. you found the API.";
const HELLO_BODY = "👋 hello, fellow developer. you found the API.";

/**
 * The "if you're reading the source, you've earned this" easter egg.
 *
 * GET /api/profile?d=<base64> returns the full structured portfolio as
 * JSON, complete with a friendly header and a stable schema. Linked from
 * an HTML comment in /share so devs who view-source can follow the trail.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const d = request.nextUrl.searchParams.get("d") ?? "";
  if (!d) {
    return NextResponse.json(
      {
        message:
          "Pass ?d=<base64-share-payload> from a /share link to see the structured portfolio.",
        hint: "Open any /share URL on this site, copy the d= query value, paste it here.",
      },
      {
        status: 400,
        headers: { "X-Hello": HELLO_HEADER },
      }
    );
  }
  if (d.length > MAX_PAYLOAD_LENGTH) {
    return NextResponse.json(
      { error: "Payload too large." },
      { status: 413, headers: { "X-Hello": HELLO_HEADER } }
    );
  }
  const payload = decodeSharePayload(d);
  if (!payload) {
    return NextResponse.json(
      { error: "Couldn't decode that payload." },
      { status: 400, headers: { "X-Hello": HELLO_HEADER } }
    );
  }

  return NextResponse.json(
    {
      _meta: HELLO_BODY,
      schemaVersion: 3,
      generator: "pm-portfolio-builder",
      ...payload,
    },
    {
      headers: {
        "X-Hello": HELLO_HEADER,
        "Cache-Control": "public, max-age=60",
      },
    }
  );
}

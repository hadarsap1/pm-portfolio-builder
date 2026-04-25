import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const storedState = request.cookies.get("gh_oauth_state")?.value;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  // Validate CSRF state
  if (!code || !returnedState || returnedState !== storedState) {
    return NextResponse.redirect(`${appUrl}/builder?error=oauth_state_mismatch`);
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.AUTH_GITHUB_ID,
      client_secret: process.env.AUTH_GITHUB_SECRET,
      code,
      redirect_uri: `${appUrl}/api/auth/callback`,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/builder?error=token_exchange_failed`);
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${appUrl}/builder?error=no_access_token`);
  }

  const response = NextResponse.redirect(`${appUrl}/builder?connected=github`);

  // Store token in httpOnly cookie — no JS access
  response.cookies.set("gh_token", tokenData.access_token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === "production",
  });

  // Clear the CSRF state cookie
  response.cookies.delete("gh_oauth_state");

  return response;
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const clientId = process.env.AUTH_GITHUB_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GitHub OAuth is not configured." }, { status: 503 });
  }

  // CSRF protection — random state stored in a short-lived cookie
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    scope: "repo",
    state,
  });

  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );

  response.cookies.set("gh_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 min
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

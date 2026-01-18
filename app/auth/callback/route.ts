export async function GET(request: Request) {
  // Magic-link/OAuth callback route is intentionally disabled.
  // This app supports email+password only, via server routes:
  // - POST /api/auth/login
  // - POST /api/auth/signup
  return new Response(
    JSON.stringify({
      error: 'Magic link / OAuth callback disabled',
      detail: 'Use email + password auth via /login and /signup.',
    }),
    {
      status: 410,
      headers: { 'content-type': 'application/json' },
    }
  );
}


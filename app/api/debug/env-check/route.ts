import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Debug endpoint to check what URL is actually being used
 * This helps identify if there's a typo in the environment variable
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // Extract hostname safely
  let hostname = "not set";
  let hasTypo = false;
  
  if (url) {
    try {
      const parsedUrl = new URL(url);
      hostname = parsedUrl.hostname;
      
      // Check for the known typo
      if (hostname.includes("cvsawjrtgmsmadtfwfa") && !hostname.includes("cvsawjrtgmsmadtrfwfa")) {
        hasTypo = true;
      }
    } catch {
      hostname = "invalid URL format";
    }
  }
  
  return NextResponse.json({
    urlSet: !!url,
    hostname,
    urlLength: url?.length || 0,
    hasTypo,
    expectedHostname: "cvsawjrtgmsmadtrfwfa.supabase.co",
    actualHostname: hostname,
    match: hostname === "cvsawjrtgmsmadtrfwfa.supabase.co",
    fix: hasTypo ? "Update NEXT_PUBLIC_SUPABASE_URL in Vercel to: https://cvsawjrtgmsmadtrfwfa.supabase.co" : null,
  });
}

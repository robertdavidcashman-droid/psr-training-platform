import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const timestamp = new Date().toISOString();

  // Check environment variables (presence only, not values)
  const envLoaded = typeof process.env !== "undefined";
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);

  // Check if content files are loadable
  let contentLoaded = false;
  try {
    const topicsPath = path.join(process.cwd(), "content", "topics.json");
    const questionsPath = path.join(process.cwd(), "content", "questions.json");
    contentLoaded = fs.existsSync(topicsPath) && fs.existsSync(questionsPath);
  } catch {
    contentLoaded = false;
  }

  // Get version from package.json
  let version = "unknown";
  try {
    const packagePath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
    version = packageJson.version || "unknown";
  } catch {
    version = "unknown";
  }

  const allChecksPass = envLoaded && contentLoaded;

  return NextResponse.json(
    {
      status: allChecksPass ? "ok" : "error",
      timestamp,
      version,
      checks: {
        envLoaded,
        openaiConfigured,
        contentLoaded,
      },
    },
    { status: allChecksPass ? 200 : 503 }
  );
}

#!/usr/bin/env node

/**
 * Interactive script to set up Clerk environment variables in Vercel
 * 
 * Usage:
 *   node scripts/setup-clerk-vercel.mjs
 * 
 * Requirements:
 *   - Vercel CLI installed: npm i -g vercel
 *   - Logged into Vercel: npx vercel login
 *   - Clerk API keys from https://dashboard.clerk.com
 */

import { execSync } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("🔐 Clerk + Vercel Environment Variables Setup\n");
  console.log("=".repeat(60));
  console.log("\nThis script will help you set Clerk environment variables in Vercel.");
  console.log("\nPrerequisites:");
  console.log("  1. Vercel CLI installed: npm i -g vercel");
  console.log("  2. Logged into Vercel: npx vercel login");
  console.log("  3. Clerk API keys from https://dashboard.clerk.com\n");
  
  const continueSetup = await question("Ready to continue? (y/n): ");
  if (continueSetup.toLowerCase() !== "y") {
    console.log("\nExiting. Run this script again when ready.");
    rl.close();
    process.exit(0);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📋 Step 1: Get Clerk API Keys");
  console.log("\n1. Go to: https://dashboard.clerk.com");
  console.log("2. Select your application (or create a new one)");
  console.log("3. Navigate to: API Keys");
  console.log("4. Copy your Publishable Key (starts with pk_)");
  console.log("5. Copy your Secret Key (starts with sk_)\n");

  const publishableKey = await question("Enter NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ");
  const secretKey = await question("Enter CLERK_SECRET_KEY: ");

  if (!publishableKey.trim() || !secretKey.trim()) {
    console.log("\n❌ Error: Both keys are required. Exiting.");
    rl.close();
    process.exit(1);
  }

  if (!publishableKey.startsWith("pk_")) {
    console.log("\n⚠️  Warning: Publishable key should start with 'pk_'");
  }
  if (!secretKey.startsWith("sk_")) {
    console.log("\n⚠️  Warning: Secret key should start with 'sk_'");
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📤 Step 2: Set Environment Variables in Vercel");
  console.log("\nThis will set variables for Production, Preview, and Development environments.\n");

  const environments = ["production", "preview", "development"];
  
  for (const env of environments) {
    console.log(`\nSetting variables for ${env}...`);
    
    try {
      // Set publishable key
      execSync(
        `npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ${env} <<< "${publishableKey.trim()}"`,
        { stdio: "inherit", shell: true }
      );
      
      // Set secret key
      execSync(
        `npx vercel env add CLERK_SECRET_KEY ${env} <<< "${secretKey.trim()}"`,
        { stdio: "inherit", shell: true }
      );
      
      console.log(`✅ ${env} environment configured`);
    } catch (error) {
      console.error(`❌ Failed to set ${env} variables:`, error.message);
      console.log("\n💡 Tip: Make sure you're logged into Vercel: npx vercel login");
      console.log("💡 Tip: You may need to run these commands manually:");
      console.log(`   npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ${env}`);
      console.log(`   npx vercel env add CLERK_SECRET_KEY ${env}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Environment Variables Setup Complete!");
  console.log("\n📋 Next Steps:");
  console.log("\n1. Configure Clerk Dashboard:");
  console.log("   - Go to: https://dashboard.clerk.com");
  console.log("   - User & Authentication → Email, Phone, Username");
  console.log("   - Disable 'Password', Enable 'Magic Link'");
  console.log("   - Paths → Set sign-in/sign-up URLs");
  console.log("   - Redirect URLs → Add: https://psrtrain.com/** and https://*.vercel.app/**");
  
  console.log("\n2. Redeploy your Vercel project:");
  console.log("   - Go to: https://vercel.com/robert-cashmans-projects/pstrain-rebuild");
  console.log("   - Click 'Redeploy' or push a new commit");
  
  console.log("\n3. Test the authentication:");
  console.log("   - Visit: https://psrtrain.com");
  console.log("   - Click 'Sign In'");
  console.log("   - Enter email → Check email for magic link → Click link");
  
  console.log("\n📚 Documentation:");
  console.log("   - See CLERK_SETUP.md for detailed Clerk configuration");
  console.log("   - See CLERK_VERCEL_ENV.md for Vercel setup details");
  
  rl.close();
}

main().catch((error) => {
  console.error("Error:", error.message);
  rl.close();
  process.exit(1);
});

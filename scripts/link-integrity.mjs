#!/usr/bin/env node

/**
 * Link Integrity Test
 * 
 * Crawls internal links starting from seed URLs and checks for:
 * - 404 errors
 * - 500 errors
 * - Redirect loops
 * 
 * Usage: node scripts/link-integrity.mjs [baseUrl]
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.argv[2] || "http://localhost:3000";
const MAX_DEPTH = 3;
const MAX_VISITS = 100; // Prevent infinite loops

// Seed URLs to start crawling from
const SEED_URLS = [
  "/",
  "/syllabus",
  "/coverage",
  "/practice",
  "/mock-exam",
  "/incidents",
  "/legal/privacy",
  "/legal/terms",
  "/legal/disclaimer",
  "/legal/contact",
];

const visited = new Set();
const errors = [];
const redirects = new Map(); // track redirect chains

/**
 * Extract internal links from HTML content
 */
function extractLinks(html, baseUrl) {
  const links = new Set();
  
  // Match href attributes
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  
  while ((match = hrefRegex.exec(html)) !== null) {
    let url = match[1];
    
    // Skip external links, mailto, tel, etc.
    if (url.startsWith("http://") || url.startsWith("https://") || 
        url.startsWith("mailto:") || url.startsWith("tel:") || 
        url.startsWith("#") || url.startsWith("javascript:")) {
      continue;
    }
    
    // Normalize URL
    if (url.startsWith("/")) {
      // Absolute path
      links.add(url.split("#")[0]); // Remove hash fragments
    } else if (url.startsWith("./") || !url.includes("://")) {
      // Relative path - skip for now (would need current page context)
      continue;
    }
  }
  
  return Array.from(links);
}

/**
 * Fetch a URL and return status and content
 */
async function fetchUrl(url) {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  
  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      redirect: "manual", // Don't follow redirects automatically
      headers: {
        "User-Agent": "PSR-Training-Link-Integrity-Test/1.0",
      },
    });
    
    const status = response.status;
    let html = "";
    
    // Only read body for successful responses
    if (status >= 200 && status < 300) {
      html = await response.text();
    }
    
    // Handle redirects
    if (status >= 300 && status < 400) {
      const location = response.headers.get("location");
      return {
        status,
        html: "",
        redirect: location,
      };
    }
    
    return {
      status,
      html,
      redirect: null,
    };
  } catch (error) {
    return {
      status: 0,
      html: "",
      error: error.message,
    };
  }
}

/**
 * Check for redirect loops
 */
function checkRedirectLoop(url, redirectChain) {
  if (redirectChain.length > 10) {
    return true; // Too many redirects
  }
  
  // Check if URL appears twice in chain
  const normalizedChain = redirectChain.map(u => u.split("?")[0].split("#")[0]);
  const normalizedUrl = url.split("?")[0].split("#")[0];
  
  return normalizedChain.filter(u => u === normalizedUrl).length > 1;
}

/**
 * Crawl URLs recursively
 */
async function crawl(url, depth = 0, redirectChain = []) {
  // Normalize URL
  const normalizedUrl = url.split("?")[0].split("#")[0];
  
  // Skip if already visited or max depth reached
  if (visited.has(normalizedUrl) || depth > MAX_DEPTH || visited.size >= MAX_VISITS) {
    return;
  }
  
  visited.add(normalizedUrl);
  
  // Fetch the page
  const result = await fetchUrl(normalizedUrl);
  
  // Handle errors
  if (result.status === 0) {
    errors.push({
      url: normalizedUrl,
      status: 0,
      error: result.error || "Network error",
    });
    return;
  }
  
  // Check for redirect loops
  if (result.redirect) {
    const newRedirectChain = [...redirectChain, normalizedUrl];
    if (checkRedirectLoop(result.redirect, newRedirectChain)) {
      errors.push({
        url: normalizedUrl,
        status: result.status,
        error: "Redirect loop detected",
        redirectChain: newRedirectChain,
      });
      return;
    }
    
    // Follow redirect (if internal)
    const redirectUrl = result.redirect.startsWith("http") 
      ? result.redirect 
      : result.redirect.startsWith("/")
        ? result.redirect
        : `${normalizedUrl.replace(/\/[^/]*$/, "/")}${result.redirect}`;
    
    if (redirectUrl.startsWith(BASE_URL) || redirectUrl.startsWith("/")) {
      await crawl(redirectUrl, depth, newRedirectChain);
    }
    return;
  }
  
  // Check status codes
  if (result.status === 404) {
    errors.push({
      url: normalizedUrl,
      status: 404,
      error: "Not found",
    });
    return;
  }
  
  if (result.status >= 500) {
    errors.push({
      url: normalizedUrl,
      status: result.status,
      error: "Server error",
    });
    return;
  }
  
  // Extract and crawl links (if successful response)
  if (result.status >= 200 && result.status < 300 && result.html && depth < MAX_DEPTH) {
    const links = extractLinks(result.html, BASE_URL);
    
    for (const link of links) {
      // Only crawl internal links
      if (link.startsWith("/") && !link.startsWith("//")) {
        await crawl(link, depth + 1, []);
      }
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log(`🔍 Link Integrity Test`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Max depth: ${MAX_DEPTH}`);
  console.log(`Seed URLs: ${SEED_URLS.length}`);
  console.log("");
  
  // Crawl from seed URLs
  for (const seedUrl of SEED_URLS) {
    await crawl(seedUrl);
  }
  
  // Report results
  console.log(`✅ Visited ${visited.size} URLs`);
  console.log("");
  
  if (errors.length === 0) {
    console.log("✅ All links are valid!");
    process.exit(0);
  } else {
    console.log(`❌ Found ${errors.length} errors:\n`);
    
    for (const error of errors) {
      console.log(`  ${error.url}`);
      console.log(`    Status: ${error.status}`);
      console.log(`    Error: ${error.error}`);
      if (error.redirectChain) {
        console.log(`    Redirect chain: ${error.redirectChain.join(" → ")}`);
      }
      console.log("");
    }
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

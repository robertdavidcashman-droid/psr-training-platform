import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure Next doesn’t infer the monorepo root from a parent lockfile.
  // This matters when this project lives inside a larger folder (e.g. OneDrive workspace).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

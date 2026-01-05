# PSR Training Platform

Professional Police Station Representative Training Platform built with Next.js and Supabase.

## Features

- ✅ Question Bank with answer options display
- ✅ Practice Mode
- ✅ Admin Question Management
- ✅ User Progress Tracking
- ✅ Authentication with Magic Links
- ✅ Auto-deployment ready

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run development server:
```bash
npm run dev
```

## Deployment

This project is configured for automatic deployment via Vercel + GitHub.

See `PUSH_TO_GITHUB.md` for setup instructions.

## Project Structure

- `app/` - Next.js app router pages
- `components/` - React components
- `lib/` - Utility functions and configurations
- `scripts/` - Database and utility scripts

## License

ISC

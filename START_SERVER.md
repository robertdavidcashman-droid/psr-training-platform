# How to Start the Development Server

## Quick Start

Open a terminal/PowerShell in the project directory and run:

```bash
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
npm run dev
```

Wait for this message:
```
✓ Ready on http://localhost:3000
```

Then open your browser to: http://localhost:3000

## Troubleshooting

**If you see "Port 3000 is already in use":**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F

# Or use a different port
$env:PORT=3001; npm run dev
```

**If you see errors:**
- Check that `.env.local` file exists with your Supabase credentials
- Make sure you've run the database migration
- Check the terminal output for specific error messages

## Keep Terminal Open

**Important:** Keep the terminal window open while using the app. Closing it will stop the server.

The server is now starting in the background. Wait about 10-20 seconds, then try http://localhost:3000 again!


























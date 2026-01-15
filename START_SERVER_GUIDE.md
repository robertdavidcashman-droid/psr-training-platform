# How to Start the Server Properly

## The Issue
"ERR_CONNECTION_REFUSED" means the development server isn't running or isn't accessible.

## Solution: Start the Server Manually

**Important:** You need to keep a terminal window open while using the app.

### Step-by-Step:

1. **Open a NEW PowerShell or Terminal window**
   - Don't close this window while using the app!

2. **Navigate to your project:**
   ```powershell
   cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
   ```

3. **Start the server:**
   ```powershell
   npm run dev
   ```

4. **Wait for this message:**
   ```
   ✓ Ready on http://localhost:3000
   ```
   (or it might say port 3001 if 3000 is busy)

5. **Then open your browser:**
   - Go to: http://localhost:3000
   - Or: http://localhost:3001 (if that's what it says)

## What You Should See

When the server starts successfully, you'll see:
```
▲ Next.js 16.1.1 (Turbopack)
- Local:         http://localhost:3000
- Environments: .env.local

✓ Ready on http://localhost:3000
```

## Keep Terminal Open!

**CRITICAL:** Keep the terminal window open! Closing it will stop the server.

## If Port 3000 is Busy

If you see "Port 3000 is in use", the server will automatically use port 3001. Just use:
- http://localhost:3001

Or kill the process on port 3000:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Troubleshooting

**Still getting connection refused?**
1. Make sure the terminal shows "Ready"
2. Check the URL matches what the terminal says (3000 or 3001)
3. Try a different browser
4. Check Windows Firewall isn't blocking it

The server is now starting in the background. Check your terminal window - it should show when it's ready!


























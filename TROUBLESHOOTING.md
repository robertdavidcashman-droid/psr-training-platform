# Troubleshooting Browser Errors

## Common Error Messages & Solutions

### "ERR_CONNECTION_REFUSED" or "localhost refused to connect"

**Problem:** The development server isn't running.

**Solution:**
1. Open a terminal/PowerShell
2. Navigate to project: `cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"`
3. Start server: `npm run dev`
4. Wait for: `✓ Ready on http://localhost:3000`
5. Then refresh browser

---

### "Invalid supabaseUrl" or Supabase connection error

**Problem:** Environment variables not loaded correctly.

**Solution:**
1. Check `.env.local` file exists in project root
2. Verify it contains (no quotes, no spaces around =):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://cvsawjrtgmsmadtfwfa.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```
3. Restart dev server after changing `.env.local`
4. Make sure file is named exactly `.env.local` (with the dot)

---

### "Table does not exist" error

**Problem:** Database migration not run or incomplete.

**Solution:**
1. Go to Supabase SQL Editor
2. Run `scripts/setup.sql` migration
3. Verify tables exist in Table Editor
4. Restart dev server

---

### Blank white page / Nothing loads

**Problem:** Could be several issues.

**Solutions:**
1. Check browser console (F12) for errors
2. Check terminal where `npm run dev` is running for errors
3. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. Clear browser cache
5. Try different browser

---

### Authentication errors / Can't sign up

**Problem:** Authentication not configured in Supabase.

**Solution:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Set Site URL: `http://localhost:3000`
3. Add Redirect URL: `http://localhost:3000/**`
4. Save and try again

---

### Build/Compilation errors

**Problem:** Code errors preventing server from starting.

**Solution:**
1. Check terminal output for specific error
2. Run: `npm run build` to see all errors
3. Fix any TypeScript/compilation errors
4. Restart dev server

---

## How to Check Server Status

**Check if server is running:**
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

**Check Node processes:**
```powershell
Get-Process -Name node
```

**Start server:**
```powershell
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
npm run dev
```

---

## Get Help

When reporting an error, please provide:
1. **Exact error message** from browser
2. **Browser console errors** (F12 → Console tab)
3. **Terminal output** from `npm run dev`
4. **What page/action** caused the error

This will help diagnose the issue quickly!


























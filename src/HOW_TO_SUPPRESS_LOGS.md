# 🔇 How to Suppress Console Logs

## Super Quick Guide

Want a clean console? Here are 3 easy ways:

---

## Method 1: Settings Toggle ⚙️

**Easiest and recommended!**

1. Click your **profile icon** (top right corner)
2. Select **"Settings"**
3. Scroll down to the **"Notifications"** card
4. Find **"Suppress Demo Logs"** toggle
5. Turn it **ON** (should turn blue)
6. Click **"Save Preferences"** button
7. **Refresh** the page (`F5` or `Cmd/Ctrl + R`)
8. ✨ Clean console!

```
Profile Icon → Settings → Notifications → 
Suppress Demo Logs [ON] → Save → Refresh
```

---

## Method 2: Browser Console 💻

**For developers and power users**

1. Open browser **Developer Tools** (`F12`)
2. Go to **Console** tab
3. Paste this code:
   ```javascript
   localStorage.setItem("honourus-suppress-demo-logs", "true");
   ```
4. Press **Enter**
5. **Reload** the page
6. ✨ Clean console!

---

## Method 3: Dismiss Notice 🔔

**Automatic suppression**

1. Wait for the **demo mode notice** to appear (bottom-right corner)
2. Click **"Don't show again"** button
3. **Refresh** the page
4. ✨ Both notice and console logs suppressed!

---

## To Re-Enable Logs

Want to see the demo mode info again?

### Via Settings
1. Settings → Notifications
2. Turn **"Suppress Demo Logs"** → OFF
3. Save → Refresh

### Via Console
```javascript
localStorage.removeItem("honourus-suppress-demo-logs");
location.reload();
```

---

## Visual Guide

### Before Suppression
```
Console:
⚠️ 🎭 DEMO MODE - Running without backend connection
⚠️ Using placeholder Supabase credentials...
⚠️ To connect to a real Supabase project:
⚠️    1. Create a project at https://supabase.com
⚠️    2. Update utils/supabase/info.tsx...
⚠️    3. Run the schema from database/schema.sql...

[Yellow warning triangles everywhere] 😰
```

### After Suppression
```
Console:
[Clean - no messages]

[Beautiful empty console] 😊
```

---

## Pro Tips 💡

### When to Suppress
- ✅ Recording screen demos
- ✅ Taking screenshots
- ✅ Daily usage (you already know it's demo mode)
- ✅ When console-sensitive

### When to Keep Enabled
- ✅ First time exploring the app
- ✅ Debugging issues
- ✅ Learning how demo mode works
- ✅ Want reminders about Supabase setup

---

## Troubleshooting

### "I did it but still see messages"
- Did you refresh the page? (`F5` or `Cmd/Ctrl + R`)
- Try hard refresh: `Cmd/Ctrl + Shift + R`
- Clear cache and try again

### "Setting isn't saving"
- Make sure you clicked **"Save Preferences"**
- Check browser console for errors
- Try the console method instead

### "I want them back but toggle doesn't work"
- Use console method: `localStorage.removeItem("honourus-suppress-demo-logs")`
- Then refresh

---

## Summary

**Fastest Way**: Settings → Suppress Demo Logs → ON → Save → Refresh

**Done in 30 seconds!** ⚡

---

*Need more help? See `/ERRORS_ALL_FIXED.md` for complete documentation.*

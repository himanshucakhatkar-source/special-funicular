# Supabase Backend Setup Guide

## ⚠️ IMPORTANT: Demo Mode Active

This application is currently running in **DEMO MODE** without a real Supabase backend. All data is stored in memory and will be lost when you refresh the page.

## Why You're Seeing the 403 Error

The 403 deployment error occurs because:
1. Figma Make detects the `/supabase/functions` directory
2. It attempts to auto-deploy edge functions to Supabase
3. Since no real Supabase project is connected, deployment fails

## How to Stop the 403 Error

### Option 1: Ignore It (Recommended for Demo)
The error doesn't affect the app's functionality. The app works perfectly in demo mode! Just close the error dialog and continue using the app.

### Option 2: Connect Real Supabase (For Production)

Follow these steps to connect a real Supabase backend and enable full features:

#### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Project name: "honourus" (or your choice)
   - Database password: (save this securely)
   - Region: (choose closest to you)
5. Wait for project to be created (~2 minutes)

#### Step 2: Get Your Credentials
1. In your Supabase dashboard, click "Settings" → "API"
2. Copy these values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon/public key**: `eyJ...` (long string starting with eyJ)

#### Step 3: Update Application Configuration
Edit `/utils/supabase/info.tsx` and replace the placeholder values:

```typescript
export const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://your-actual-project-id.supabase.co');
export const publicAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJ_your_actual_anon_key_here');
```

#### Step 4: Set Up Database Schema
1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Copy the entire contents of `/database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute

#### Step 5: Deploy Edge Functions (Optional)
The edge functions in `/supabase/functions` are optional. If you want to deploy them:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref [your-project-id]
   ```

3. Deploy functions:
   ```bash
   supabase functions deploy server
   supabase functions deploy analytics-contribution-heatmap
   supabase functions deploy analytics-unsung-hero
   supabase functions deploy integrations-callback
   supabase functions deploy integrations-connect
   ```

## Current Demo Mode Features

### ✅ Working Features
- Full UI/UX functionality
- Task management (create, update, delete, drag-and-drop)
- Recognition system
- Team collaboration
- Analytics dashboard
- Keyboard shortcuts
- Theme system with Christmas & Diwali themes
- All views and components

### ❌ Limitations (Require Supabase)
- Data persistence (changes lost on refresh)
- Multi-user collaboration
- Real-time synchronization
- Email authentication
- Password reset
- External integrations (Jira, ClickUp, etc.)
- Analytics history

## Verification

After connecting Supabase, you should see in the console:

```
✅ Connected to Supabase project: your-project-id
🔄 Real-time data synchronization enabled
```

Instead of:

```
🎭 DEMO MODE - Running without backend connection
⚠️ Using placeholder Supabase credentials...
```

## Troubleshooting

### Still seeing 403 error after connecting?
1. Double-check your credentials in `/utils/supabase/info.tsx`
2. Make sure you copied the full URL and key (no extra spaces)
3. Verify your Supabase project is active (green status in dashboard)
4. Try refreshing the page

### Can't run SQL schema?
- Make sure you're using the SQL Editor (not the Table Editor)
- Run the schema in sections if there are errors
- Check that your database password was correctly set

### Edge functions not deploying?
- Verify Supabase CLI is installed: `supabase --version`
- Make sure you're logged in: `supabase login`
- Check that your project is linked: `supabase projects list`

## Support

For more help:
- Supabase Docs: https://supabase.com/docs
- Honourus Guidelines: `/guidelines/Guidelines.md`
- Error Fixes: `/ERRORS_FIXED.md`

## Summary

**Current State**: Demo mode with mock data
**To Enable Backend**: Follow Steps 1-4 above
**Edge Functions**: Optional (Step 5)
**403 Error**: Safe to ignore in demo mode, will resolve when Supabase is connected

---

*This app is designed to work perfectly in both demo mode and production mode with Supabase connected!*

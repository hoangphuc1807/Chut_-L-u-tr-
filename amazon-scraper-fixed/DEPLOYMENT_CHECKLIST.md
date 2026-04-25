# 📋 Deployment Checklist

Print this page and check off each item as you complete it.

---

## PHASE 1: SUPABASE SETUP ⏱️ 5 minutes

### Create Project
- [ ] Visit https://supabase.com
- [ ] Click "Start your project"
- [ ] Sign in (or create account)
- [ ] Click "New project"
- [ ] Fill in project name (e.g., "amazon-scraper")
- [ ] Set region (closest to your location)
- [ ] Set database password (SAVE THIS)
- [ ] Click "Create new project"
- [ ] Wait ~2 minutes for project to provision

### Get API Credentials
- [ ] Go to project dashboard
- [ ] Click "Settings" (left sidebar)
- [ ] Click "API"
- [ ] Copy **Project URL** (starts with `https://`)
  ```
  Save: ____________________
  ```
- [ ] Copy **Anon/Public** key (under "Project API keys")
  ```
  Save: ____________________
  ```

### Create Database Tables
- [ ] Still in Supabase dashboard
- [ ] Click "SQL Editor" (left sidebar)
- [ ] Click "New query"
- [ ] Open file: `SUPABASE_SCHEMA.sql`
- [ ] Copy ALL SQL code
- [ ] Paste into SQL Editor
- [ ] Click "Run" button
- [ ] Verify: "Success" message appears

### Verify Tables
- [ ] Click "Table Editor" (left sidebar)
- [ ] Check: "sessions" table exists
- [ ] Check: "products" table exists
- [ ] Click "sessions" → Verify fields (id, created_at, keywords, etc.)
- [ ] Click "products" → Verify fields (asin, title, price, etc.)

---

## PHASE 2: EXTENSION UPDATE ⏱️ 2 minutes

### Verify Code Changes
- [ ] Open file: `manifest.json`
  - Verify: `"https://*.supabase.co/*"` in `host_permissions`
- [ ] Open file: `background.js`
  - Search for: `getSupabaseConfig()`
  - Search for: `pushToSupabase()`
  - Search for: `await pushToSupabase(sessionData)`
- [ ] Open file: `popup.html`
  - Search for: `supabaseSettings` (should exist)
  - Search for: `⚙️ Supabase Settings`
- [ ] Open file: `popup.js`
  - Search for: `btnSaveConfig`
  - Search for: `btnTestConfig`

### Reload Extension
- [ ] Open Chrome
- [ ] Go to `chrome://extensions/`
- [ ] Find "Amazon Product Scraper"
- [ ] Click **Reload** button (circular arrow icon)
- [ ] Verify: No red error banner appears

---

## PHASE 3: CONFIGURE EXTENSION ⏱️ 2 minutes

### Open Extension Settings
- [ ] Click extension icon (top-right corner)
- [ ] Click extension popup
- [ ] Scroll down
- [ ] Click "⚙️ Supabase Settings" header
- [ ] Settings section expands

### Enter Credentials
- [ ] Field 1: "Project URL"
  - [ ] Click input field
  - [ ] Paste URL from Phase 1
  - [ ] Example: `https://abcdefgh.supabase.co`
- [ ] Field 2: "Anon Key"
  - [ ] Click input field
  - [ ] Paste Key from Phase 1
  - [ ] Example: `eyJhbGciOiJIUzI1NiIs...`
- [ ] Check: Both fields filled (no empty fields)

### Save Configuration
- [ ] Click "💾 Lưu" button
- [ ] Wait 1 second
- [ ] Verify: Green text appears below saying "✅ Đã lưu!"

### Test Connection
- [ ] Click "🔌 Test kết nối" button
- [ ] Wait 2-3 seconds
- [ ] Verify: Green text says "✅ Kết nối thành công!"
- [ ] If fails: Check URL + Key format, try again

---

## PHASE 4: TEST INTEGRATION ⏱️ 10 minutes

### Test Scrape
- [ ] Extension popup
- [ ] Click "Nhập Keywords"
- [ ] Type one keyword: `gift for mom`
- [ ] Select "1 trang" from dropdown
- [ ] Click "🚀 Bắt đầu cào dữ liệu"
- [ ] Wait for scraping to complete
- [ ] Verify: Green ✅ appears saying "Hoàn tất!"
- [ ] Note session ID from completion message

### Check Browser Console
- [ ] Press F12 (open DevTools)
- [ ] Click "Console" tab
- [ ] Look for message: `[Supabase] ✅ Pushed XXX products to Supabase`
- [ ] Verify: Message appears (X = ~30)
- [ ] Check: No red error messages

### Verify Supabase Data
- [ ] Open Supabase in new tab
- [ ] Click "Table Editor"
- [ ] Click "sessions" table
- [ ] Verify: 1 new row appears
  - [ ] `id` field has value
  - [ ] `keywords` array shows your keyword
  - [ ] `total_products` shows ~30
- [ ] Click "products" table
- [ ] Verify: ~30 new rows appear
  - [ ] Column "asin" has values (e.g., B0CXXXXX)
  - [ ] Column "title" has product names
  - [ ] Column "price_numeric" has numbers (e.g., 49.99)
  - [ ] Column "type" shows "Organic" or "Sponsored"

### Check Data Quality
- [ ] Click one product row
- [ ] Verify: Fields are populated
  - [ ] keyword: "gift for mom"
  - [ ] asin: B0CXXXXX (10+ chars)
  - [ ] price_numeric: 49.99
  - [ ] stars_numeric: 4.5
  - [ ] type: "Organic" or "Sponsored"

---

## PHASE 5: METABASE SETUP ⏱️ 5 minutes

### Install Metabase

#### Option A: Docker (Recommended)
- [ ] Open terminal
- [ ] Run:
  ```bash
  docker run -d -p 3000:3000 --name metabase metabase/metabase
  ```
- [ ] Wait 30-60 seconds (first startup is slow)
- [ ] Open: http://localhost:3000
- [ ] First time: Fill in setup form (create admin account)

#### Option B: JAR File
- [ ] Download from https://www.metabase.com/start/
- [ ] Open terminal, navigate to download folder
- [ ] Run:
  ```bash
  java -jar metabase.jar
  ```
- [ ] Wait 30-60 seconds
- [ ] Open: http://localhost:3000

### Connect Database
- [ ] Metabase homepage
- [ ] Click **Admin settings** (gear icon, top-right)
- [ ] Click **Databases** (left sidebar)
- [ ] Click **Add database**
- [ ] Select **PostgreSQL**
- [ ] Fill in form:

| Field | Value |
|-------|-------|
| Name | Amazon Scraper |
| Host | `db.xxxxx.supabase.co` |
| Port | 5432 |
| Database name | postgres |
| Username | postgres |
| Password | (from Supabase Settings → Database) |
| SSL mode | require |

- [ ] Click **Save**
- [ ] Click **Test connection**
- [ ] Verify: "We found some tables!" appears

### Refresh Metadata (if needed)
- [ ] Still in Admin settings
- [ ] Click **Databases** again
- [ ] Click on "Amazon Scraper" database
- [ ] Click **Refresh** button
- [ ] Wait for completion

---

## PHASE 6: CREATE TEST DASHBOARD ⏱️ 5 minutes

### Create Dashboard
- [ ] Click "Dashboards" (top navigation)
- [ ] Click "Create a new dashboard"
- [ ] Name: `Amazon Market - Overview`
- [ ] Click "Create"
- [ ] Click "Enter edit mode" (or edit icon)

### Add Test Card (Simple Count)
- [ ] Click "Add a card"
- [ ] Click "Metabase query"
- [ ] Paste this SQL:
  ```sql
  SELECT COUNT(*) as total_products
  FROM products;
  ```
- [ ] Click "Visualize"
- [ ] Should see a number (~30)
- [ ] Click "Save"
- [ ] Add to "Amazon Market - Overview"
- [ ] Click "Save"

### Add Test Card (Products by Keyword)
- [ ] Click "Add a card"
- [ ] Click "Metabase query"
- [ ] Paste this SQL:
  ```sql
  SELECT keyword, COUNT(*) as product_count
  FROM products
  GROUP BY keyword
  ORDER BY product_count DESC;
  ```
- [ ] Click "Visualize"
- [ ] Should see table with keyword + count
- [ ] Click "Visualize" → Choose "Bar" chart type
- [ ] Click "Save"

### View Dashboard
- [ ] Click "Exit edit mode"
- [ ] Verify: 2 cards display
- [ ] Verify: Numbers match your data
- [ ] Verify: No errors appear

---

## PHASE 7: TEAM VALIDATION ⏱️ 5 minutes

### Share Dashboard
- [ ] Still on dashboard
- [ ] Click "3 dots" menu (top-right)
- [ ] Click "Share dashboard"
- [ ] Toggle "Public" → ON
- [ ] Copy public link
- [ ] Save link:
  ```
  http://localhost:3000/public/...
  ```

### Test Access
- [ ] Open link in incognito window
- [ ] Verify: Dashboard visible without login
- [ ] Verify: Cards display correctly
- [ ] Verify: Numbers visible

### Send to Team
- [ ] Copy dashboard link
- [ ] Send to team via email/Slack
- [ ] Ask team to:
  - [ ] Click link
  - [ ] View dashboard
  - [ ] Report if working

---

## PHASE 8: FINAL VALIDATION ✅

### Code Review
- [ ] Open `manifest.json` → Verify Supabase host permission ✅
- [ ] Open `background.js` → Verify Supabase functions exist ✅
- [ ] Open `popup.html` → Verify settings section exists ✅
- [ ] Open `popup.js` → Verify config handlers exist ✅

### Functional Tests
- [ ] Extension loads → No errors ✅
- [ ] Settings visible → Can input URL+Key ✅
- [ ] Test connection → Shows ✅ ✅
- [ ] Scrape works → Completes successfully ✅
- [ ] Data syncs → Appears in Supabase ✅
- [ ] Metabase connects → Sees data ✅
- [ ] Dashboard works → Shows charts ✅
- [ ] Team can access → Link works ✅

### Documentation
- [ ] Created: `SUPABASE_SCHEMA.sql` ✅
- [ ] Created: `SUPABASE_INTEGRATION_GUIDE.md` ✅
- [ ] Created: `METABASE_SETUP.md` ✅
- [ ] Created: `README_SUPABASE.md` ✅
- [ ] Created: `QUICK_REFERENCE.txt` ✅

---

## COMPLETION SUMMARY

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Supabase Setup | ⏳ | Should be done |
| 2. Extension Update | ⏳ | Code already done, just verify |
| 3. Configuration | ⏳ | Should be quick |
| 4. Test Integration | ⏳ | Most important phase |
| 5. Metabase Setup | ⏳ | Should be straightforward |
| 6. Test Dashboard | ⏳ | Verify end-to-end |
| 7. Team Validation | ⏳ | Share with team |
| 8. Final Validation | ⏳ | Confirm everything works |

**Total Time:** ~30 minutes for first-time setup

---

## 🎯 Success Indicators

You're successful when:

- [ ] Extension popup has settings section
- [ ] Can enter URL + Key
- [ ] Test connection succeeds
- [ ] Supabase has tables with data
- [ ] Metabase shows database
- [ ] Dashboard displays charts
- [ ] Team can access dashboard link

---

## 🚨 If Something Breaks

### Extension Won't Reload
1. [ ] Close Chrome completely
2. [ ] Reopen Chrome
3. [ ] Go to chrome://extensions
4. [ ] Try reload again

### Settings Section Not Appearing
1. [ ] Check `popup.html` has settings div
2. [ ] Reload extension
3. [ ] Check console (F12) for errors

### Test Connection Fails
1. [ ] Copy URL again from Supabase (fresh)
2. [ ] Copy Key again (full string)
3. [ ] Make sure URL has `https://`
4. [ ] Try test again

### No Data in Supabase
1. [ ] Check scrape completed (popup shows ✅)
2. [ ] Check console (F12) for [Supabase] message
3. [ ] Wait 5 seconds, refresh Supabase page
4. [ ] Try scraping again

### Metabase Won't Connect
1. [ ] Check Docker running: `docker ps`
2. [ ] Verify credentials: Host, Port, Database, User, Password
3. [ ] Check SSL mode set to "require"
4. [ ] Restart Docker: `docker restart metabase`

---

## 📞 Need Help?

1. **Read:** SUPABASE_INTEGRATION_GUIDE.md (detailed guide)
2. **Check:** Browser console (F12 → Console)
3. **Verify:** Supabase tables have data
4. **Verify:** Metabase can query
5. **Debug:** Use SQL queries directly in Supabase SQL Editor

---

## ✨ When You're Done

Celebrate! 🎉 You now have:

✅ Automatic data syncing  
✅ Live dashboards  
✅ Team collaboration  
✅ Zero manual uploads  
✅ Real-time analytics  

**Next:** Create more Metabase dashboards for deeper insights.

---

**Print this page and check off each item!**

**Last Updated:** 2024-04-23

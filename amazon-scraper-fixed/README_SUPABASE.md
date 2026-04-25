# 🚀 Amazon Scraper + Supabase + Metabase Implementation

**Status:** ✅ FULLY IMPLEMENTED

## What's New? 🎯

Your Amazon scraper extension now **automatically syncs data to the cloud** and displays it on a live dashboard.

### Before ❌
```
Extension → Chrome Storage (50 sessions max)
Team → Manual Excel export → Share via email
```

### After ✅
```
Extension → Supabase (unlimited data)
Team → Real-time Metabase dashboard (auto-updating)
```

---

## 📁 Files Changed/Created

### Modified Files
| File | Changes |
|------|---------|
| `manifest.json` | ✅ Added `https://*.supabase.co/*` to `host_permissions` |
| `background.js` | ✅ Added `getSupabaseConfig()` + `pushToSupabase()` functions |
| `popup.html` | ✅ Added Supabase Settings section with CSS |
| `popup.js` | ✅ Added config save/load + connection test handlers |

### New Files
| File | Purpose |
|------|---------|
| `SUPABASE_SCHEMA.sql` | SQL schema to create tables in Supabase |
| `METABASE_SETUP.md` | Complete Metabase installation & dashboard guide |
| `SUPABASE_INTEGRATION_GUIDE.md` | Step-by-step implementation checklist |
| `README_SUPABASE.md` | This file - overview & quick reference |

---

## 🔄 How It Works

### Architecture
```
1. You scrape keywords
   ↓
2. Extension extracts products
   ↓
3. Saves to chrome.storage (Excel export)
   ↓
4. PUSHES TO SUPABASE (new)
   ├─ Sessions table (1 row per scrape)
   └─ Products table (many rows per scrape)
   ↓
5. Metabase reads Supabase
   ↓
6. Dashboard shows live data
   ↓
7. Team sees charts without reopening extension
```

### Data Flow Diagram
```
Chrome Extension             Supabase PostgreSQL          Metabase Dashboard
┌──────────────┐           ┌──────────────┐             ┌─────────────┐
│ Scrape data  │──REST API→│  sessions    │ ← SQL ──────│  Charts &   │
│              │  (POST)   │  products    │  Query      │  Reports    │
└──────────────┘           └──────────────┘             └─────────────┘
     (popup)                  (cloud DB)                 (dashboard)
```

---

## 🛠️ Quick Setup (15 minutes)

### 1️⃣ Supabase Setup (5 min)
```bash
1. Go to https://supabase.com
2. Create project
3. Copy URL + Anon Key
4. Run SQL from SUPABASE_SCHEMA.sql
5. Verify: 2 tables created (sessions + products)
```

### 2️⃣ Extension Configuration (2 min)
```bash
1. Reload extension (chrome://extensions)
2. Open extension popup
3. Click "⚙️ Supabase Settings"
4. Paste URL + Key
5. Click "🔌 Test kết nối"
```

### 3️⃣ Test (3 min)
```bash
1. Scrape 1 keyword (1 page)
2. Check Supabase tables (should have data)
3. Check browser console [Supabase] ✅ messages
```

### 4️⃣ Metabase (5 min)
```bash
1. Run Docker: docker run -d -p 3000:3000 metabase/metabase
2. Open http://localhost:3000
3. Connect Supabase database
4. Create dashboards from SQL queries
```

**Total: ~15 minutes from start to live dashboard!**

---

## 📊 What Data is Synced?

### Sessions Table
- `id`: Unique session identifier
- `created_at`: Timestamp
- `keywords`: Array of searched keywords
- `num_pages`: Pages scraped per keyword
- `total_products`: Count of all products
- `valid_products`: Count of valid products
- `invalid_products`: Count of invalid products

### Products Table
- `asin`: Amazon ASIN code
- `title`: Product title
- `price` / `price_numeric`: Price (text + parsed number)
- `stars` / `stars_numeric`: Rating (text + parsed number)
- `review_count` / `review_count_numeric`: Reviews (text + parsed)
- `keyword`: Search keyword used
- `rank`: Position on page (1-48)
- `type`: "Organic" or "Sponsored"
- `seller`, `store`, `sold`, `image`, `listing_date`, etc.

---

## 🔑 Important: Credential Management

### Where to Get Credentials

**Supabase → Settings → API:**
```
Project URL: https://xxxxx.supabase.co
Anon Key:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Supabase → Settings → Database:**
```
Host:     db.xxxxx.supabase.co
Port:     5432
Database: postgres
User:     postgres
Password: (your db password)  ← For Metabase
```

### Security ⚠️
- ✅ Anon Key stored in `chrome.storage.local` (secure)
- ✅ Not hardcoded in files
- ⚠️ If leaked: Regenerate key in Supabase Settings

---

## 📈 Sample Dashboard Queries

### 1. Total Products by Keyword
```sql
SELECT keyword, COUNT(*) as count
FROM products
GROUP BY keyword
ORDER BY count DESC;
```

### 2. Organic vs Sponsored Ratio
```sql
SELECT type, COUNT(*) as count, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) as pct
FROM products
GROUP BY type;
```

### 3. Price Distribution
```sql
SELECT 
  CASE WHEN price_numeric < 25 THEN '$0-25'
       WHEN price_numeric < 50 THEN '$25-50'
       ELSE '$50+' END as range,
  COUNT(*) as count
FROM products
WHERE price_numeric IS NOT NULL
GROUP BY range;
```

### 4. Top 10 Sellers
```sql
SELECT seller, COUNT(*) as count
FROM products
WHERE seller != 'N/A'
GROUP BY seller
ORDER BY count DESC
LIMIT 10;
```

See `METABASE_SETUP.md` for more queries and dashboard templates.

---

## ⚙️ Configuration Guide

### Enable Supabase Sync

1. **Open extension popup**
2. **Scroll to bottom** → Click "⚙️ Supabase Settings"
3. **Paste URL:**
   ```
   https://xxxxx.supabase.co
   ```
4. **Paste Key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. **Click 💾 Lưu**
6. **Click 🔌 Test kết nối** → Should see ✅

### Disable Sync (Optional)
- Leave URL/Key empty → Extension will skip Supabase push
- Excel export still works

---

## 🧪 Testing Checklist

Before deploying:

- [ ] Extension reloads without errors
- [ ] Popup shows "⚙️ Supabase Settings" section
- [ ] Can enter URL + Key without crashes
- [ ] Test connection shows ✅
- [ ] Scrape 1 keyword completes successfully
- [ ] Browser console shows `[Supabase] ✅ Pushed XXX products`
- [ ] Supabase `sessions` table has 1 new row
- [ ] Supabase `products` table has ~30 new rows
- [ ] Metabase queries return data without errors
- [ ] Dashboard charts display correctly

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Test kết nối" fails | Check URL format: `https://xxxxx.supabase.co` |
| No data appears in Supabase | Check browser console for errors, verify scrape completed |
| Products table empty | Run scrape again, tables might not have refreshed |
| Metabase "Connection refused" | Check Metabase running: `docker ps` or Java process |
| Metabase "authentication failed" | Use `postgres` user, get password from Supabase Settings |

See `SUPABASE_INTEGRATION_GUIDE.md` for detailed troubleshooting.

---

## 📚 Documentation Files

**Start here → Read in order:**

1. **README_SUPABASE.md** ← You are here (overview)
2. **SUPABASE_INTEGRATION_GUIDE.md** (step-by-step checklist)
3. **SUPABASE_SCHEMA.sql** (SQL to run in Supabase)
4. **METABASE_SETUP.md** (Metabase installation + queries)

---

## 🎯 Next Actions

### Immediate (Today)
- [ ] Read this file → Understand architecture
- [ ] Follow `SUPABASE_INTEGRATION_GUIDE.md` checklist
- [ ] Set up Supabase + Metabase
- [ ] Test with 1 scrape

### Short-term (This week)
- [ ] Train team on dashboard
- [ ] Set up Metabase alerts/reports
- [ ] Automate daily scrapes (optional)

### Long-term (Future)
- [ ] Add more custom dashboards
- [ ] Integrate with Slack/Email alerts
- [ ] Archive old sessions (cost optimization)
- [ ] Advanced analytics (price trends, competitor tracking)

---

## 💬 Questions?

**Check logs:**
```
Browser: F12 → Console → [Supabase] messages
Supabase: SQL Editor → SELECT COUNT(*) FROM products;
Metabase: Admin → Databases → Test connection
```

**Common questions:**
- Q: Will Excel export still work?
  - A: Yes! Still saves to Excel AND pushes to Supabase

- Q: What if Supabase key is wrong?
  - A: Extension skips Supabase push, works normally

- Q: Can multiple people scrape?
  - A: Yes! All pushes to same Supabase (no conflicts)

- Q: How much does Supabase cost?
  - A: Free tier: 500MB storage, enough for months of data

- Q: Can I scrape without Metabase?
  - A: Yes! Supabase standalone is useful. Metabase just visualizes it.

---

## ✨ Features Summary

| Feature | Before | After |
|---------|--------|-------|
| **Data Storage** | Browser (50 sessions) | Cloud (unlimited) |
| **Data Backup** | None | Automatic |
| **Dashboard** | Excel file | Live Metabase |
| **Real-time** | Manual share | Auto-updating |
| **Team Access** | Email files | Share link |
| **Analytics** | Excel pivot | Metabase charts |
| **Cost** | Free | Free (Supabase tier) |

---

## 🎉 You're All Set!

The implementation is complete. Your extension now has:

✅ Cloud synchronization  
✅ Real-time dashboard  
✅ Zero downtime  
✅ Auto-updating reports  
✅ Team collaboration  

**Ready to scrape and see live analytics!**

---

**Version:** 1.0  
**Last Updated:** 2024-04-23  
**Compatibility:** Chrome Extension Manifest v3

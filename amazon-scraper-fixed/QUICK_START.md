# 🚀 Quick Start - Amazon Scraper v2.0

## Installation (60 seconds)

### Step 1: Open Chrome Extensions
```
1. Open Chrome browser
2. Type in address bar: chrome://extensions
3. Press Enter
```

### Step 2: Enable Developer Mode
```
1. Look at TOP RIGHT corner
2. Toggle "Developer mode" ON (it will turn blue)
```

### Step 3: Load Extension
```
1. Click "Load unpacked" button (appears after enabling Developer mode)
2. Navigate to: /Users/nguyenphuc/Downloads/amazon-scraper-fixed/
3. Click "Select Folder"
4. Extension will load automatically
```

### Step 4: Verify Installation
```
✓ Extension appears in list as "Amazon Product Scraper" v2.0
✓ Icon appears in Chrome toolbar (top right)
✓ No errors shown
```

---

## First Use (2 minutes)

### 1. Open Extension
```
Click the extension icon in toolbar (top right)
Popup window opens with blue header
```

### 2. Enter Keywords
```
Paste this example:
    gifts for mom
    gifts for dad
    gifts for wife

(One keyword per line)
```

### 3. Select Pages
```
Choose: "3 trang (full)" 
(or 1-2 for quick test)
```

### 4. Start Scraping
```
Click: 🚀 Bắt đầu cào dữ liệu

Watch the progress:
- Blue progress bar shows overall progress
- 4 stat boxes show live numbers
- Log shows each action in detail
```

### 5. Get Results
```
When done:
✓ Green checkmark appears
✓ Excel file auto-downloads to Downloads folder
✓ File name: amazon_scraper_YYYY-MM-DD.xlsx
```

---

## View Session History

### Click Dashboard
```
1. Click 📊 button (top right of popup)
2. New tab opens with session history
3. See all previous scraping sessions
4. Click "📥 Export" to re-download any session
5. Click "🗑️ Xoá" to delete old sessions
```

---

## Understanding the Stats Box

```
┌─────────┬──────────┬──────────┬──────────┐
│    0    │    0     │    0     │   0/0    │
│  Cần    │ Hợp lệ  │ Loại bỏ │ Keywords │
│ Verify  │   ✅    │   ❌    │ Progress │
└─────────┴──────────┴──────────┴──────────┘

Cần Verify: Total products found on Amazon
Hợp lệ ✅: Products that are currently available
Loại bỏ ❌: Products that are out of stock
Keywords Progress: How many keywords completed
```

---

## Excel File Explanation

### What You Get
```
15 columns of data:
1. Keyword - Which search term this product came from
2. ASIN - Amazon product code
3. Rank - Position on search results (1, 2, 3...)
4. Title - Product name
5. Image - Product image URL
6. Price - Listed price
7. Sold - How many sold in past month
8. Listing Date - When product was first listed
9. Store - Seller store name
10. Seller - Seller company name
11. Stars - Star rating (e.g., 4.5 sao)
12. Reviews - Number of customer reviews
13. Detailed Seller - Full seller information
14. Type - "Organic" or "Sponsored"
15. Timestamp - When this product was scraped
```

### How to Use Excel
```
✓ Filter by "Type" to see only Organic products
✓ Sort by "Stars" to find top-rated products
✓ Filter by "Price" for budget analysis
✓ Use "Timestamp" to know when data was collected
✓ Group by "Keyword" to analyze per search term
```

---

## Common Issues & Solutions

### Problem: Extension doesn't appear
**Solution:**
- Refresh chrome://extensions (press F5)
- Check that file path is correct
- Try disabling/enabling extension

### Problem: Popup is blank
**Solution:**
- Right-click extension → "Remove"
- Reload unpacked extension again
- Clear Chrome cache (Settings > Privacy)

### Problem: Scraping very slow
**Solution:**
- Check internet speed
- Close other tabs
- Try again during off-peak hours

### Problem: Excel doesn't download
**Solution:**
- Check Downloads folder
- Check Chrome download settings
- Try Dashboard > Export Session instead

### Problem: Dashboard shows no sessions
**Solution:**
- Refresh Dashboard page (F5)
- Check if scraping completed fully
- Look at popup "done" message

---

## Tips & Tricks

### Quick Test
```
Use 1 keyword + 1 page to test quickly
Takes ~1 minute for full run
```

### Best Results
```
✓ Use morning hours (fewer people = faster)
✓ 1-3 pages per keyword (diminishing returns after)
✓ Wait 5 minutes between runs
✓ Check Dashboard regularly to manage storage
```

### Large Scrapes
```
For 10+ keywords:
- Use 1 page per keyword first (to test)
- Then run again with 2-3 pages
- Check storage doesn't exceed quota
```

---

## Storage Management

### Check Storage Usage
```
chrome://extensions > Amazon Product Scraper > 
Storage (shows size in KB)
```

### Free Up Space
```
1. Click 📊 Dashboard
2. Find old sessions
3. Click 🗑️ to delete
4. Confirm deletion
```

### Auto-management
```
- Max 50 sessions stored
- Oldest automatically removed when limit exceeded
- Each session ~200KB
- 50 sessions = ~10MB (safe limit)
```

---

## Support Quick Links

| Issue | Solution |
|-------|----------|
| Extension won't load | See troubleshooting above |
| Stats not updating | Refresh popup & try again |
| Excel missing columns | Recreate session/re-export |
| Storage full | Delete sessions from Dashboard |
| Scraping takes forever | Check internet + try 1 page |

---

## Version Info
- **Version**: 2.0
- **Release**: 2026-04-21
- **Status**: Stable & Production Ready
- **Browser**: Chrome 88+, Edge, Opera

---

## Next Steps

1. ✅ Extension loaded?
2. 📝 Entered keywords?
3. ▶️ Started scraping?
4. 📊 Got results in Excel?
5. 📈 Checked Dashboard?

**You're all set! Start scraping now! 🚀**

---

For detailed info, see:
- README.md - Technical overview
- USER_GUIDE_v2.0.md - Complete guide
- UPGRADE_SUMMARY.md - Feature details

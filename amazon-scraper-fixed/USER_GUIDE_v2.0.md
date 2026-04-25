# Amazon Scraper Extension v2.0 - User Guide

## 🚀 Quick Start

### 1. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `/Users/nguyenphuc/Downloads/amazon-scraper-fixed/` folder
5. Extension should appear with version 2.0

### 2. Using the Extension
1. Click extension icon to open popup
2. Enter keywords (one per line)
3. Select number of pages (1-3)
4. Click **🚀 Bắt đầu cào dữ liệu**
5. Watch stats update in real-time
6. Excel file downloads automatically when done

---

## 📊 New Features in v2.0

### Stats Box (4 Real-time Counters)
Shows while scraping:
- **Cần Verify**: Total products found
- **Hợp lệ ✅**: Products that passed filtering (available)
- **Loại bỏ ❌**: Products excluded (unavailable/not found)
- **Keywords Progress**: x/total keywords completed

### Product Filtering
- ❌ **Automatically skips** out-of-stock products
- ❌ **Automatically skips** temporarily unavailable products
- ✅ **Keeps** all currently available products
- ✅ **Keeps** both Organic and Sponsored listings

### Excel Export (15 Columns)
New columns added:
1. **Rank** - Position on search results page
2. **Type** - "Organic" or "Sponsored"
3. **Timestamp** - When product was scraped (UTC)

Full column list:
```
Keyword | ASIN | Rank | Title | Image | Price | Sold | 
Listing Date | Store | Seller | Stars | Reviews | 
Detailed Seller | Type | Timestamp
```

### Dashboard (📊 Button)
Access session history:
1. Click **📊** button in popup header
2. New tab opens showing all saved sessions
3. Each session shows:
   - When it was scraped
   - Keywords used
   - How many products valid/invalid
4. **Export** any previous session (without re-scraping)
5. **Delete** old sessions to free storage

### Session Management
- Automatically saves all sessions to browser storage
- Keeps up to 50 sessions (~10MB)
- Can re-export any session as Excel
- Sessions persist between browser sessions

---

## 💡 Usage Examples

### Example 1: Basic Scraping
**Goal**: Scrape 3 popular gift keywords from page 1

```
Input:
  Keywords: gifts for mom
             gifts for dad
             gifts for wife
  Pages: 1
  
Result: 
  ~50-80 products depending on availability
  Stats show: 70 total, 62 valid, 8 unavailable
```

### Example 2: Multi-page Deep Scan
**Goal**: Comprehensive product research

```
Input:
  Keywords: laptop bags
  Pages: 3
  
Result:
  ~250+ products from 3 pages
  Dashboard saves session for later reference
```

### Example 3: Re-export Session
**Goal**: Need Excel file again without re-scraping

```
Steps:
  1. Click 📊 Dashboard
  2. Find desired session
  3. Click 📥 Export
  4. Excel downloads immediately
```

---

## ⚙️ Settings & Options

### Number of Pages
- **1 page**: Quick scan (~30 products per keyword)
- **2 pages**: Balanced (~60 products per keyword)
- **3 pages**: Full scan (~90 products per keyword)

### Keywords Input
- One keyword per line
- Spaces trimmed automatically
- Empty lines ignored
- Min: 1 keyword, Max: unlimited

---

## 📈 What Gets Tracked

### Per Session
- ✅ Session ID (unique)
- ✅ Timestamp (when scraping started)
- ✅ Keywords list
- ✅ Pages per keyword setting
- ✅ All products with full data
- ✅ Stats (total, valid, invalid)

### Per Product
- ✅ Keyword (which search it came from)
- ✅ ASIN (Amazon product ID)
- ✅ Rank (position on page)
- ✅ Type (Organic or Sponsored)
- ✅ Timestamp (when checked)
- ✅ All original data (price, reviews, etc.)

---

## 🛡️ Important Notes

### Availability Detection
- Uses text patterns from product page
- **3 patterns detected**:
  - "currently unavailable"
  - "temporarily out of stock"
  - "this item is currently unavailable"
- Only checks English Amazon.com
- Text-based (no click/button checking)

### Cross-Keyword Deduplication
- If ASIN appears in multiple keywords
- Product appears **only once** under first keyword
- **Why?** Prevents duplicate rows in Excel
- Saves processing time

### Storage Management
- Max 50 sessions stored
- Oldest sessions auto-deleted when over limit
- Each session ~200KB (100 products)
- 50 sessions = ~10MB (safe limit)

### Performance Notes
- Scraping speed: ~5-10 seconds per product
- Page loading: ~800ms per page
- Excel generation: ~5 seconds
- Dashboard load: Instant (local storage)

---

## 🐛 Troubleshooting

### Stats Not Updating
**Problem**: Stats box shows but doesn't change
**Solution**: 
- Refresh extension
- Close and re-open popup
- Check browser console for errors

### Excel Not Downloading
**Problem**: File doesn't appear in Downloads
**Solution**:
- Check browser download settings
- Ensure popup stays open during export
- Try Dashboard > Export Session

### Dashboard Shows No Sessions
**Problem**: Scraped but nothing in Dashboard
**Solution**:
- Refresh Dashboard page (F5)
- Check if scraping fully completed
- Look at popup done message

### Products Still Showing Despite Unavailable
**Problem**: Out-of-stock products in Excel
**Solution**:
- Amazon page DOM might have changed
- Check manually if product is truly available
- Report issue with product ASIN

---

## 📱 Keyboard Shortcuts
None currently configured, but you can add via:
- Chrome Extensions settings
- Assign shortcut to open popup
- Assign shortcut to open Dashboard

---

## 🔄 Update History

### v2.0 (2026-04-21)
✅ NEW Product availability filtering
✅ NEW 15-column Excel export (Rank, Type, Timestamp)
✅ NEW Session management & storage
✅ NEW Dashboard for session history
✅ NEW Real-time statistics display
✅ IMPROVED Search result extraction
✅ IMPROVED Cross-keyword deduplication

### v1.4 → v2.0 Migration
- All v1.4 data incompatible (different schema)
- Start fresh with v2.0
- Old files won't open but manual copy possible

---

## 📞 Support

### Common Issues
1. **Extension won't load**: Check Chrome version (need 88+)
2. **Popup opens blank**: Clear extension data & reload
3. **Scraping very slow**: Check internet speed
4. **Dashboard won't open**: Try right-click > Report bug

### Check These First
- Chrome version: Chrome Menu > About Google Chrome
- Extension enabled: chrome://extensions
- Storage available: chrome://extensions > Service Worker logs
- Console errors: Right-click popup > Inspect > Console

---

## 🎯 Tips & Best Practices

### For Best Results
1. **Use 1-3 pages per keyword**: Diminishing returns after
2. **Morning scrapes**: Fewer users = faster page loads
3. **Wait between runs**: Give Amazon servers breathing room
4. **Check availability manually**: For critical products
5. **Export regularly**: Don't rely on 50-session limit

### Dataset Quality
- ✅ Filter out unavailable products (automatic)
- ✅ Note: Rank resets per keyword (not global rank)
- ✅ Sponsored = Sponsored by sellers, not Amazon
- ✅ Reviews count = User ratings, not reviews
- ✅ Store name = Seller store (if third-party)

### Excel Best Practices
- Use "Listing Date" for product age analysis
- Filter by "Type" to separate organic vs sponsored
- Use "Timestamp" to track when data was collected
- Note: Prices might be outdated (not live updated)

---

## Version Info
- **Current**: v2.0
- **Release**: 2026-04-21
- **Status**: Stable
- **Target**: Chrome, Edge, Opera (Chromium)

---

**Enjoy scraping! Questions? Check UPGRADE_SUMMARY.md or IMPLEMENTATION_CHECKLIST.md**

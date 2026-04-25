# Amazon Scraper → Supabase Integration Guide

## 📋 Quick Summary

This implementation adds **automatic cloud synchronization** to your Amazon scraper:

```
Chrome Extension (cào)
    ↓ fetch() REST API
Supabase PostgreSQL (Database)
    ↓ PostgreSQL connection
Metabase Dashboard (Analytics)
    ↓
Team Product xem charts trực tiếp 📊
```

**Lợi ích:**
- ✅ Dữ liệu tự động lưu lên cloud (không lo mất)
- ✅ Team xem dashboard thực tế (không cần cào lại)
- ✅ Phân tích dữ liệu visual qua Metabase
- ✅ Không ảnh hưởng flow cũ (vẫn có Excel export)

---

## 🔧 Implementation Checklist

### Phase 1: Supabase Setup (5 phút)

- [ ] **1.1** Tạo tài khoản Supabase: https://supabase.com (nếu chưa có)
- [ ] **1.2** Tạo project mới
- [ ] **1.3** Lấy **Project URL** và **Anon Key** từ Settings → API
- [ ] **1.4** Vào **SQL Editor** → Copy toàn bộ SQL từ `SUPABASE_SCHEMA.sql` → Run
- [ ] **1.5** Verify: Vào **Table Editor** → Thấy 2 tables: `sessions` + `products`

### Phase 2: Extension Update (5 phút)

- [ ] **2.1** File `manifest.json` đã update (host_permissions thêm Supabase)
- [ ] **2.2** File `background.js` đã thêm:
  - `getSupabaseConfig()` function
  - `pushToSupabase()` function
  - Gọi `pushToSupabase()` sau `saveSession()`
- [ ] **2.3** File `popup.html` thêm Supabase settings section
- [ ] **2.4** File `popup.js` thêm config handlers (Save + Test buttons)
- [ ] **2.5** Reload extension trong Chrome:
  - Vào `chrome://extensions/`
  - Tìm "Amazon Product Scraper"
  - Nhấn **Reload** button

### Phase 3: Configure Extension (2 phút)

- [ ] **3.1** Mở extension popup
- [ ] **3.2** Mở settings section: **⚙️ Supabase Settings**
- [ ] **3.3** Paste Project URL vào field 1
- [ ] **3.4** Paste Anon Key vào field 2
- [ ] **3.5** Nhấn **💾 Lưu**
- [ ] **3.6** Nhấn **🔌 Test kết nối** → Thấy ✅ "Kết nối thành công!"

### Phase 4: Test Integration (10 phút)

- [ ] **4.1** Scrape 1 keyword (1 page) để test
- [ ] **4.2** Mở Supabase → **Table Editor** → `sessions` table
  - Phải thấy 1 row với session ID, keywords, stats
- [ ] **4.3** Mở `products` table
  - Phải thấy ~30 products row từ keyword đó
  - Kiểm tra fields: `asin`, `title`, `price_numeric`, `stars_numeric`, `type`
- [ ] **4.4** Check logs (browser console):
  - Mở DevTools (F12) → Console
  - Phải thấy: `[Supabase] ✅ Pushed XXX products to Supabase`

### Phase 5: Metabase Setup (20 phút)

- [ ] **5.1** Cài Metabase (Docker hoặc JAR) - Xem `METABASE_SETUP.md`
- [ ] **5.2** Kết nối Supabase database
- [ ] **5.3** Tạo 4 Dashboards từ SQL queries (hoặc tuỳ ý)
- [ ] **5.4** Share dashboard link với team

### Phase 6: Team Testing (5 phút)

- [ ] **6.1** Team vào dashboard link
- [ ] **6.2** Xem các charts hoạt động
- [ ] **6.3** Chạy scrape lần nữa → Dashboard update tự động

---

## 🚀 Workflow sau khi Setup

**Mỗi lần cào:**

1. Mở extension → Nhập keywords
2. Nhấn "🚀 Bắt đầu cào dữ liệu"
3. Chờ hoàn tất (popup báo ✅)
4. **Tự động:**
   - Lưu vào `chrome.storage.local` (Excel export)
   - Đẩy lên Supabase (Cloud)
5. Team xem **Metabase dashboard** → Dữ liệu real-time

**Không cần:**
- ❌ Export Excel, share file
- ❌ Upload file thủ công
- ❌ Team cào lại dữ liệu

---

## 📊 What Data Gets Synced

### Sessions Table
```
id: session_xxx_unique
created_at: 2024-04-23 14:30:00
keywords: ["gift for mom", "gifts for dad"]
num_pages: 3
total_products: 180
valid_products: 170
invalid_products: 10
```

### Products Table
```
session_id: session_xxx_unique
keyword: "gift for mom"
asin: B0CXXXXX
rank: 1
title: "Best Gift Set for Mom"
price: "$49.99"
price_numeric: 49.99
stars: "4.5 sao"
stars_numeric: 4.5
review_count: "1,234"
review_count_numeric: 1234
type: "Organic" (hoặc "Sponsored")
scraped_at: 2024-04-23 14:31:00
... (20+ fields)
```

---

## 🔐 Security Notes

### Anon Key vs Service Key

- **Anon Key** (dùng trong extension):
  - Bất kì ai có key này có thể INSERT dữ liệu
  - OK vì chỉ dùng cho extension của bạn
  - ⚠️ Không để public trên GitHub

- **Service Key** (dùng cho backend):
  - Full permissions (CREATE, DELETE, UPDATE)
  - Giữ bí mật, không đặt trong extension
  - Dùng cho backend automation (nếu có)

### Best Practices

- ✅ Mở extension settings → Nhập key trực tiếp (không hardcode)
- ✅ Key lưu trong `chrome.storage.local` (encrypted by browser)
- ✅ Không commit key vào Git
- ✅ Nếu leak key: vào Supabase → Settings → Re-generate key

---

## 🐛 Troubleshooting

### Problem: "Lỗi 401 Unauthorized"
**Nguyên nhân:** Key/URL sai

**Giải pháp:**
1. Copy lại URL và Key từ Supabase Settings
2. Xóa cài đặt: Inspect → Storage → `supabaseConfig` → Delete
3. Nhập lại và Test

### Problem: "Lỗi 413 Request Entity Too Large"
**Nguyên nhân:** Batch quá lớn (>100 products)

**Giải pháp:** Sẽ tự fix trong code (chia batch 100 rows)

### Problem: "Network error / CORS"
**Nguyên nhân:** Supabase URL sai format

**Giải pháp:**
- Đúng: `https://abcdefgh.supabase.co`
- Sai: `abcdefgh.supabase.co` (thiếu https://)
- Sai: `https://supabase.co` (thiếu project ID)

### Problem: "Mấy table mà không thấy dữ liệu"
**Giải pháp:**
1. Kiểm tra Metabase refresh table metadata: Admin → Database → Refresh
2. Chạy query trực tiếp Supabase SQL Editor:
   ```sql
   SELECT COUNT(*) FROM products;
   SELECT COUNT(*) FROM sessions;
   ```
3. Nếu return 0 → extension chưa push dữ liệu

---

## 📈 Next Steps

### Nếu muốn mở rộng:

1. **Real-time sync** (not just on scrape end):
   - Thêm listener onChange
   - Push từng product ngay khi extract

2. **Duplicate detection**:
   - Kiểm tra ASIN đã tồn tại chưa trước insert
   - Update price/rank thay vì insert mới

3. **Webhook alerts**:
   - Slack/Email notification khi có deal tốt
   - Metabase → Email scheduled reports

4. **Advanced analytics**:
   - Price trend over time
   - Competitor tracking
   - Ranking improvement

---

## 📞 Support

**Nếu gặp issue:**

1. Check browser console (F12 → Console)
   - Xem log messages: `[Supabase] ...`

2. Check Supabase Activity:
   - Supabase → SQL Editor → Query:
   ```sql
   SELECT * FROM sessions ORDER BY created_at DESC LIMIT 5;
   ```

3. Check Metabase logs:
   - Browser DevTools → Network
   - Xem requests tới Metabase, kiểm tra errors

4. Check extension background:
   - `chrome://extensions/` → "Amazon Product Scraper" → Inspect views

---

**Xong! 🎉 Ready to use!**

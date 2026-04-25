# 🚀 SETUP TỪNG BƯỚC - AMAZON SCRAPER + SUPABASE + METABASE

**Thời gian:** ~30 phút  
**Độ khó:** Dễ ✅  
**Cần chuẩn bị:** Browser + 1 keyword để test

---

## ⏱️ PHASE 1: SUPABASE SETUP (5 phút)

### Bước 1.1: Tạo Supabase Project

```
1. Mở: https://supabase.com
2. Click "Start your project"
3. Sign in (hoặc tạo account)
4. Click "New project"
5. Nhập:
   - Project name: "amazon-scraper" (hoặc tên khác)
   - Password: Nhập mật khẩu (LƯU LẠI - dùng sau cho Metabase)
   - Region: Chọn gần Việt Nam (Singapore hoặc Tokyo)
6. Click "Create new project"
7. ⏳ Chờ 1-2 phút (project đang tạo...)
8. ✅ Xong! Bạn vào project dashboard
```

### Bước 1.2: Lấy Credentials

```
1. Vào Settings (left sidebar) → API
2. Tìm "Project URL" → COPY và LƯU:
   https://xxxxx.supabase.co
   
3. Tìm "Anon/Public key" → COPY và LƯU:
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
4. Lưu vào đâu đó an toàn (password manager hoặc note)
```

### Bước 1.3: Tạo Database Tables

```
1. Quay lại Supabase dashboard
2. Click "SQL Editor" (left sidebar)
3. Click "New query"
4. Mở file: ~/Documents/amazon-scraper-fixed/SUPABASE_SCHEMA.sql
5. Copy TẤT CẢ SQL code
6. Paste vào SQL Editor
7. Click "Run" button
8. ✅ Xong! Nên thấy "Success" message
```

### Bước 1.4: Verify Tables

```
1. Click "Table Editor" (left sidebar)
2. Tìm table "sessions":
   ✅ Có không? → OK!
   
3. Tìm table "products":
   ✅ Có không? → OK!
   
4. Nếu không có → Quay lại 1.3, run SQL lại
```

**✅ PHASE 1 DONE!**

---

## ⏱️ PHASE 2: CONFIGURE EXTENSION (2 phút)

### Bước 2.1: Reload Extension

```
1. Mở Chrome
2. Vào: chrome://extensions/
3. Tìm "Amazon Product Scraper"
4. Click nút "Reload" (circular arrow icon)
5. ✅ Xong! Không thấy lỗi đỏ
```

### Bước 2.2: Open Settings

```
1. Click extension icon (top-right corner của Chrome)
2. Click popup của extension
3. Scroll xuống dưới
4. Click "⚙️ Supabase Settings" header
5. ✅ Phần settings mở ra (expand)
```

### Bước 2.3: Nhập Credentials

```
1. Field "Project URL":
   - Click vào field
   - Paste URL từ 1.2:
     https://xxxxx.supabase.co
   
2. Field "Anon Key":
   - Click vào field
   - Paste Key từ 1.2:
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
3. Verify: Cả 2 field phải có dữ liệu
```

### Bước 2.4: Save Config

```
1. Click nút "💾 Lưu"
2. Chờ 1 giây
3. ✅ Thấy text xanh: "✅ Đã lưu!"
```

### Bước 2.5: Test Connection

```
1. Click nút "🔌 Test kết nối"
2. Chờ 2-3 giây
3. ✅ Thấy text xanh: "✅ Kết nối thành công!"

Nếu thấy ❌:
  → Check URL có "https://" không?
  → Check Key đủ dài (>100 ký tự)?
  → Copy lại từ Supabase
  → Try again
```

**✅ PHASE 2 DONE!**

---

## ⏱️ PHASE 3: TEST INTEGRATION (3 phút)

### Bước 3.1: Scrape Test

```
1. Extension popup
2. Click "Nhập Keywords"
3. Xóa placeholder text
4. Type: "gift for mom"
5. Chọn "1 trang" từ dropdown
6. Click "🚀 Bắt đầu cào dữ liệu"
7. ⏳ Chờ... (~ 2-3 phút)
8. ✅ Xong! Popup hiện ✅ "Hoàn tất!"
```

### Bước 3.2: Check Browser Console

```
1. Nhấn F12 (mở DevTools)
2. Click "Console" tab
3. Tìm message: [Supabase] ✅ Pushed XXX products
4. ✅ Thấy message? → Data đã sync!

Nếu thấy ❌:
  → Có error message không?
  → Nếu có: Copy error → fix theo hướng dẫn
  → Nếu không: Config có sai?
```

### Bước 3.3: Verify Supabase Data

```
1. Mở Supabase trong tab khác
2. Click "Table Editor"
3. Click "sessions":
   - ✅ Thấy 1 row mới?
   - Có field: id, keywords, total_products, etc.?
   
4. Click "products":
   - ✅ Thấy ~30 rows mới?
   - Có field: asin, title, price, stars, etc.?
   
Nếu data không có:
  → Wait 5 seconds, refresh page
  → Quay lại 3.1, scrape lại
  → Check console có error?
```

**✅ PHASE 3 DONE!**

---

## ⏱️ PHASE 4: METABASE SETUP (5 phút)

### Bước 4.1: Install Metabase (choose one)

#### Option A: Docker (Khuyến nghị - dễ nhất)

```bash
# Mở Terminal/Command Prompt
docker run -d -p 3000:3000 --name metabase metabase/metabase

# ⏳ Chờ 30-60 giây (lần đầu khá lâu)
# Mở: http://localhost:3000
# Tạo admin account (follow on-screen)
```

#### Option B: JAR File

```bash
# Download: https://www.metabase.com/start/
# Mở Terminal, navigate tới download folder
java -jar metabase.jar

# ⏳ Chờ 30-60 giây
# Mở: http://localhost:3000
```

### Bước 4.2: Connect Supabase Database

```
1. Metabase dashboard
2. Click ⚙️ "Admin settings" (top-right)
3. Click "Databases" (left sidebar)
4. Click "Add database"
5. Select "PostgreSQL"
6. Nhập thông tin:

   Name:           Amazon Scraper
   Host:           db.xxxxx.supabase.co
   Port:           5432
   Database name:  postgres
   Username:       postgres
   Password:       (Supabase DB password từ 1.1)
   SSL mode:       require ← QUAN TRỌNG!

7. Click "Save"
8. Click "Test connection"
9. ✅ Thấy "We found some tables!"
```

**✅ PHASE 4 DONE!**

---

## ⏱️ PHASE 5: CREATE TEST DASHBOARD (5 phút)

### Bước 5.1: Create Dashboard

```
1. Click "Dashboards" (top navigation)
2. Click "Create a new dashboard"
3. Name: "Amazon Data - Test"
4. Click "Create"
5. Click "Enter edit mode"
```

### Bước 5.2: Add Simple Card

```
1. Click "Add a card"
2. Click "Metabase query"
3. Paste SQL:
   SELECT COUNT(*) as total_products FROM products;

4. Click "Visualize"
5. ✅ Thấy số ~30?
6. Click "Save"
7. Click "Save" again → add to dashboard
```

### Bước 5.3: Add Second Card

```
1. Click "Add a card"
2. Click "Metabase query"
3. Paste SQL:
   SELECT keyword, COUNT(*) as count
   FROM products
   GROUP BY keyword
   ORDER BY count DESC;

4. Click "Visualize"
5. ✅ Thấy table/chart?
6. Click "Visualize" → "Bar" (để thấy rõ hơn)
7. Click "Save"
```

### Bước 5.4: View Dashboard

```
1. Click "Exit edit mode"
2. ✅ Thấy 2 cards?
3. ✅ Numbers correct?
4. ✅ No errors?

→ Perfect! Dashboard hoạt động!
```

**✅ PHASE 5 DONE!**

---

## ✅ FINAL VERIFICATION

Kiểm tra tất cả:

- [ ] Extension popup có "⚙️ Supabase Settings" section?
- [ ] Có thể enter URL + Key?
- [ ] Test connection thành công?
- [ ] Scrape hoàn tất (popup shows ✅)?
- [ ] Supabase có data?
- [ ] Browser console có [Supabase] ✅ message?
- [ ] Metabase connect thành công?
- [ ] Dashboard hiển thị charts?

**Nếu tất cả ✅ → BẠN XONG RỒI!**

---

## 🎉 YOU DID IT!

Bây giờ bạn có:
- ✅ Automatic cloud sync
- ✅ Real-time dashboard
- ✅ Team collaboration
- ✅ Data persistence

### 🚀 Next Steps:

**Today:**
- Scrape thêm keywords khác
- Create thêm dashboards

**This Week:**
- Share dashboard với team
- Get feedback

**This Month:**
- Automate daily scrapes
- Add more advanced dashboards
- Set up alerts

---

## ❓ TROUBLESHOOTING

### Extension settings không hiện?
- [ ] Reload extension (chrome://extensions)
- [ ] Close Chrome hoàn toàn, reopen
- [ ] Check console (F12) có error?

### Test connection fails
- [ ] URL có "https://" không?
- [ ] Copy lại URL + Key từ Supabase
- [ ] Paste full string (không thêm space)

### Supabase không có data
- [ ] Scrape hoàn tất (popup shows ✅)?
- [ ] Check console [Supabase] message?
- [ ] Wait 5s, refresh Supabase page
- [ ] Try scrape lại 1 keyword

### Metabase không connect
- [ ] Docker running? (docker ps)
- [ ] Port 3000 free? (lsof -i :3000)
- [ ] Check username: postgres (exact!)
- [ ] Check password (case-sensitive!)

---

## 💬 NEED HELP?

1. Check console: F12 → Console tab
2. Check Supabase: SQL Editor → SELECT COUNT(*) FROM products;
3. Check Metabase: Admin → Databases → Test connection
4. Read: SUPABASE_INTEGRATION_GUIDE.md (detailed troubleshooting)

---

**Congratulations! 🎉 You've successfully integrated your Amazon scraper with Supabase & Metabase!**

**Ready to scrape and analyze! 🚀**

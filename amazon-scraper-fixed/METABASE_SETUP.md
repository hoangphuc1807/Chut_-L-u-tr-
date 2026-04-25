# Metabase Setup Guide for Amazon Scraper Data

## Part 1: Cài đặt Metabase

### Cách 1: Docker (Khuyến nghị - Nhanh nhất)

```bash
docker run -d \
  -p 3000:3000 \
  --name metabase \
  metabase/metabase:latest

# Chờ 30-60 giây cho service khởi động
# Mở: http://localhost:3000
```

### Cách 2: Download JAR file

1. Download: https://www.metabase.com/start/
2. Chạy:
   ```bash
   java -jar metabase.jar
   ```
3. Mở: http://localhost:3000

### Cách 3: Heroku (Deploy công cộng)

1. Push code lên GitHub
2. Deploy bằng Heroku button
3. Lưu ý: Free tier Heroku đã hết, có thể dùng Railway hoặc Render

---

## Part 2: Kết nối Supabase vào Metabase

### Bước 1: Lấy thông tin kết nối từ Supabase

1. Đăng nhập vào Supabase
2. Chọn project của bạn
3. Vào **Settings** → **Database** → **Connection info**
4. Copy các thông tin sau:
   - **Host**: `db.{project-ref}.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (Tìm trong Settings → Database → Database password)

### Bước 2: Cấu hình trong Metabase

1. **Đăng nhập Metabase**: http://localhost:3000
2. Vào **Admin settings** → **Databases**
3. Nhấn **Add database**
4. Chọn **PostgreSQL**
5. Điền thông tin:
   - **Name**: `Amazon Scraper` (hay tên gì cũng được)
   - **Host**: `db.{project-ref}.supabase.co`
   - **Port**: `5432`
   - **Database name**: `postgres`
   - **Username**: `postgres`
   - **Password**: (Supabase DB password)
   - **SSL mode**: `require` (QUAN TRỌNG cho Supabase)
6. Nhấn **Save** → **Test connection**
7. Nếu thành công sẽ thấy ✅ "We found some tables!"

---

## Part 3: Tạo Dashboards cho Team Product

### Dashboard 1: Overview - Tổng quan Market

**Thêm Card 1: Tổng số sản phẩm theo keyword**

```sql
SELECT 
  keyword,
  COUNT(DISTINCT asin) as total_asins,
  COUNT(*) as total_listings
FROM products
GROUP BY keyword
ORDER BY total_asins DESC;
```

**Thêm Card 2: Tỉ lệ Organic vs Sponsored**

```sql
SELECT 
  type,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) as percentage
FROM products
WHERE type IN ('Organic', 'Sponsored')
GROUP BY type
ORDER BY count DESC;
```

**Thêm Card 3: Phân phối giá (Price Range)**

```sql
SELECT 
  CASE 
    WHEN price_numeric < 10 THEN '$0-10'
    WHEN price_numeric < 25 THEN '$10-25'
    WHEN price_numeric < 50 THEN '$25-50'
    WHEN price_numeric < 100 THEN '$50-100'
    ELSE '$100+'
  END as price_range,
  COUNT(*) as product_count
FROM products
WHERE price_numeric IS NOT NULL
GROUP BY price_range
ORDER BY price_range;
```

**Thêm Card 4: Số lượng reviews trung bình**

```sql
SELECT 
  keyword,
  ROUND(AVG(CAST(review_count_numeric AS NUMERIC)), 0) as avg_reviews,
  AVG(stars_numeric) as avg_stars
FROM products
WHERE review_count_numeric IS NOT NULL AND stars_numeric IS NOT NULL
GROUP BY keyword
ORDER BY avg_reviews DESC;
```

---

### Dashboard 2: Seller Intelligence - Phân tích Seller

**Thêm Card: Top 10 Sellers**

```sql
SELECT 
  seller,
  COUNT(DISTINCT asin) as unique_products,
  COUNT(*) as total_listings,
  AVG(stars_numeric) as avg_rating,
  COUNT(DISTINCT keyword) as num_keywords
FROM products
WHERE seller != 'N/A'
GROUP BY seller
ORDER BY total_listings DESC
LIMIT 10;
```

**Thêm Card: Seller by Type**

```sql
SELECT 
  seller,
  type,
  COUNT(*) as count
FROM products
WHERE seller != 'N/A'
GROUP BY seller, type
ORDER BY seller, type;
```

---

### Dashboard 3: Trend Analysis - Theo dõi ASIN

**Thêm Card: ASIN xuất hiện nhiều nhất**

```sql
SELECT 
  asin,
  COUNT(DISTINCT keyword) as num_keywords,
  COUNT(*) as num_appearances,
  STRING_AGG(DISTINCT keyword, ', ') as keywords,
  AVG(stars_numeric) as avg_stars,
  MAX(rank) as best_rank
FROM products
WHERE asin != 'N/A'
GROUP BY asin
ORDER BY num_appearances DESC
LIMIT 20;
```

**Thêm Card: Rank Evolution (cần scrape nhiều lần)**

```sql
SELECT 
  asin,
  DATE(scraped_at) as scrape_date,
  MIN(rank) as best_rank,
  MAX(rank) as worst_rank,
  AVG(rank) as avg_rank
FROM products
WHERE asin != 'N/A' AND rank IS NOT NULL
GROUP BY asin, DATE(scraped_at)
ORDER BY scrape_date, asin;
```

---

### Dashboard 4: Data Quality - Chất lượng dữ liệu

**Thêm Card: Missing Data**

```sql
SELECT 
  'Price' as field,
  COUNT(CASE WHEN price IS NULL OR price = 'N/A' THEN 1 END) as missing,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(CASE WHEN price IS NULL OR price = 'N/A' THEN 1 END) / COUNT(*), 1) as missing_pct
FROM products
UNION ALL
SELECT 'Stars', COUNT(CASE WHEN stars = 'N/A' THEN 1 END), COUNT(*), ROUND(100.0 * COUNT(CASE WHEN stars = 'N/A' THEN 1 END) / COUNT(*), 1) FROM products
UNION ALL
SELECT 'Reviews', COUNT(CASE WHEN review_count = 'N/A' THEN 1 END), COUNT(*), ROUND(100.0 * COUNT(CASE WHEN review_count = 'N/A' THEN 1 END) / COUNT(*), 1) FROM products
UNION ALL
SELECT 'Image', COUNT(CASE WHEN image = 'No Image Available' THEN 1 END), COUNT(*), ROUND(100.0 * COUNT(CASE WHEN image = 'No Image Available' THEN 1 END) / COUNT(*), 1) FROM products;
```

**Thêm Card: Scrape Summary**

```sql
SELECT 
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(DISTINCT keyword) as total_keywords,
  COUNT(DISTINCT asin) as unique_asins,
  COUNT(*) as total_listings,
  MAX(created_at) as last_scrape,
  COUNT(CASE WHEN type = 'Organic' THEN 1 END) as organic,
  COUNT(CASE WHEN type = 'Sponsored' THEN 1 END) as sponsored
FROM products;
```

---

## Part 4: Cách tạo một Dashboard trong Metabase

1. Vào **Dashboards** → **Create a new dashboard**
2. Đặt tên: `Amazon Market - Overview` (hay tên khác)
3. Nhấn **Create** → **Enter edit mode** (hoặc nhấn edit icon)
4. Nhấn **Add a card** (hoặc **+** button)
5. Chọn **Metabase query** hoặc **Raw query**
6. Copy một trong các SQL ở trên → Paste vào SQL editor
7. Nhấn **Visualize** để xem kết quả
8. Chọn **Chart type** (Line, Bar, Number, Table, etc.)
9. Nhấn **Save** → Lưu thêm vào dashboard

---

## Part 5: Cách Share Dashboard với Team

1. Mở dashboard
2. Nhấn **3 dots** → **Share dashboard**
3. Tùy chọn:
   - **Public link**: Chia sẻ URL (bất kì ai có link)
   - **Team members**: Share với user trong Metabase
   - **Embed**: Nhúng vào website/Slack

---

## Troubleshooting

### Lỗi: "Connection refused"
- Kiểm tra Metabase đã start chưa: `docker ps` (nếu dùng Docker)
- Kiểm tra port 3000 không bị chiếm: `lsof -i :3000`

### Lỗi: "password authentication failed"
- Kiểm tra lại Supabase DB password (Case-sensitive)
- Kiểm tra username là `postgres` đúng không

### Lỗi: "SSL error"
- Đảm bảo **SSL mode** được set thành `require` trong database settings

### Dữ liệu chưa hiện
- Chạy scrape ít nhất 1 keyword
- Kiểm tra Supabase `products` table có dữ liệu chưa
- Ở Metabase, vào **Admin** → **Databases** → **Refresh table metadata** (nếu dữ liệu vừa thêm)

---

## Tips & Tricks

### Cache dữ liệu
- Dashboard có cache mặc định 60s
- Để xem dữ liệu real-time: nhấn **Refresh** button

### Tạo Alert
- **Dashboards** → Chọn card → **3 dots** → **Alert**
- Ví dụ: Alert nếu giá sản phẩm tăng hơn 10%

### Export data
- Mở báo cáo → **3 dots** → **Download results** → CSV hoặc XLSX

### Scheduled reports
- **Dashboards** → **3 dots** → **Email** → Set frequency
- Team sẽ nhận email báo cáo theo lịch

---

## Tài liệu tham khảo

- Metabase Docs: https://metabase.com/docs/
- Supabase PostgreSQL: https://supabase.com/docs/guides/database
- Query Builder: https://metabase.com/docs/latest/users-guide/query-builder

---

## Điều gì xảy ra tiếp?

Sau khi setup xong:

1. ✅ Extension tự động push dữ liệu lên Supabase
2. ✅ Team xem dashboard trực tiếp (không cần export Excel)
3. ✅ Dữ liệu update real-time mỗi lần cào
4. ✅ Có thể tạo thêm báo cáo tùy ý bằng SQL trong Metabase

**Enjoy! 🚀**

---
type: system
status: active
created: 2026-04-17
tags: [workflow, system, organization]
---

# 📝 Hệ Thống Lưu Context - Đang Thảo Luận

## 🎯 Mục Đích
Khi tắt tab đang thảo luận vấn đề gì đó, cần lưu lại **context** để có thể tiếp tục thảo luận sau mà không mất thông tin.

---

## ✅ Các Component

### 1️⃣ **Template**
- **File**: `.templates/conversation-snapshot.md`
- **Dùng để**: Copy khi cần tạo snapshot note

### 2️⃣ **Workflow - Khi Muốn Tắt Tab**

**Bước 1**: Gõ **"tắt tab"** (hoặc từ khóa tương tự)
```
Từ khóa trigger:
- "tắt tab"
- "tắt"
- "close tab"
- Các biến thể tương tự
```

**Bước 2**: Tôi sẽ hỏi
```
"Bạn có muốn lưu context để thảo luận tiếp không?"
```

**Bước 3**: Nếu **"Có"**
- Tôi jump template lên
- Giúp fill info nhanh
- Tạo file ở `Inbox/_Important/`

**Bước 4**: Tắt tab an tâm! 😌

---

## 🔄 **Workflow - Khi Muốn Tiếp Tục**

1. Mở file ở `Inbox/_Important/[topic] - Thảo Luận.md`
2. Tag: `@claudian`
3. Nói: "Tiếp tục cuộc thảo luận"
4. Tôi sẽ đọc context + tiếp tục giúp!

---

## 📋 **Template Structure**

```markdown
---
type: conversation
status: active
created: {{DATE}}
tags: [discussion, pending]
---

# {{TOPIC}} - Đang Thảo Luận

## 📋 Tóm Tắt Vấn Đề
[Mô tả vấn đề]

## 💭 Điểm Đã Discuss
- [ ] Điểm 1
- [ ] Điểm 2
- [ ] Điểm 3

## ❓ Câu Hỏi / Hướng Đi Tiếp Theo
[Câu hỏi tiếp theo]

## 📎 Ngữ Cảnh Bổ Sung
[Code, screenshot, links, v.v.]

## 🔗 Liên Quan
- 
- 

---

**Ghi chú cho @claudian**: 
[Hướng dẫn đặc biệt]
```

---

## 🧠 **Memory/Automation**
- ✅ Tôi đã **ghi nhớ** từ khóa "tắt tab"
- ✅ Khi bạn gõ, tôi sẽ **tự động hỏi** + offer lưu
- ✅ **Không cần** setup trong settings.json

---

## 📌 **Quick Reference**

| Bước | Hành Động |
|------|----------|
| Muốn tắt tab | Gõ: "tắt tab" |
| Tôi hỏi | "Bạn có muốn lưu context?" |
| Chọn "Có" | Tôi jump template + help fill |
| Tắt tab | Yên tâm 😌 |
| Muốn tiếp tục | Mở file + tag @claudian |

---

**Status**: ✅ **Active & Ready**

**Cập nhật**: 2026-04-17
**Vai trò**: Claudian (COO)

---
type: system
status: active
created: 2026-04-17
tags: [obsidian, github, automation, backup]
---

# 🔗 Obsidian ↔ GitHub Auto-Sync Setup

## 📋 Tóm Tắt
**Obsidian vault tự động backup lên GitHub mỗi 1 tiếng**, không cần bạn làm gì!

---

## 🎯 Cách Hoạt Động

```
Obsidian (edit files)
    ↓ (mỗi 1 tiếng)
Auto-commit script
    ↓ (dùng SSH)
GitHub push
    ↓
GitHub updated ✅
```

---

## ⚙️ **Các Component**

### 1️⃣ **GitHub Repo**
- **URL**: `https://github.com/hoangphuc1807/Chut_-L-u-tr-`
- **Status**: Public
- **Description**: Personal systems & workflows

### 2️⃣ **Local Git Repo**
- **Location**: `~/chut-systems/`
- **Remote**: SSH (`git@github.com:hoangphuc1807/Chut_-L-u-tr-.git`)
- **Branch**: `main`

### 3️⃣ **SSH Key**
- **Private key**: `~/.ssh/id_ed25519`
- **Public key**: Đã add vào GitHub Settings
- **Type**: ED25519 (an toàn, không hết hạn)

### 4️⃣ **Auto-commit Script**
- **File**: `~/chut-systems/auto-commit.sh`
- **Tác dụng**: 
  - Check xem có changes
  - Nếu có → `git add .` + `git commit "Vault auto-save"` + `git push`
  - Log vào `.auto-commit.log`

### 5️⃣ **Cron Job**
- **Schedule**: `0 * * * *` (mỗi giờ vào phút 0)
- **Command**: `~/chut-systems/auto-commit.sh`
- **Status**: ✅ Active

---

## 📂 **File Structure**

```
~/chut-systems/
├── Hệ Thống Lưu Context.md     ← Document quan trọng
├── auto-commit.sh              ← Script auto-sync
├── .auto-commit.log            ← Log file
├── .git/                        ← Git metadata
└── .gitignore                   ← Ignore rules (nếu có)
```

---

## 🚀 **Cách Sử Dụng**

### **Bước 1: Edit files trong Obsidian**
```
Obsidian → Edit files → Save
```

### **Bước 2: Automatic sync** (không cần làm gì!)
```
Mỗi 1 tiếng → Auto-commit + push lên GitHub
```

### **Bước 3: Check GitHub**
```
https://github.com/hoangphuc1807/Chut_-L-u-tr-
→ Xem commits & files
```

---

## 🔍 **Verify Sync**

### **Check local log:**
```bash
tail ~/.auto-commit.log
```

**Output ví dụ:**
```
✅ Auto-commit at Fri Apr 17 21:51:15 PDT 2026
⏭️  No changes at Fri Apr 17 22:51:15 PDT 2026
✅ Auto-commit at Fri Apr 17 23:51:15 PDT 2026
```

### **Check GitHub:**
Vào `https://github.com/hoangphuc1807/Chut_-L-u-tr-`
→ Xem commits list
→ Tìm "Vault auto-save" messages

---

## 🛠️ **Manual Sync (nếu cần)**

**Commit ngay (không chờ 1 tiếng):**
```bash
cd ~/chut-systems
git add .
git commit -m "Manual update"
git push origin main
```

---

## ⚠️ **Troubleshooting**

### **Problem: Cron job không chạy**
**Solution:**
```bash
crontab -l  # Check cron job
```

Nếu không thấy, thêm lại:
```bash
crontab -e
# Thêm dòng: 0 * * * * ~/chut-systems/auto-commit.sh
```

### **Problem: SSH authentication fail**
**Solution:**
1. Check SSH key: `ssh -T git@github.com`
2. Nếu fail → Verify SSH key đã add vào GitHub Settings
3. Restart SSH agent: `eval "$(ssh-agent -s)"`

### **Problem: Commit không hiển thị GitHub**
**Solution:**
```bash
cd ~/chut-systems
git log --oneline  # Check local commits
git push origin main  # Push manually
```

---

## 📊 **Status Monitoring**

**Check tình trạng sync:**

```bash
# Xem commit gần đây
git log --oneline -5

# Xem cron job logs
log show --predicate 'process == "cron"' --last 1h

# Xem auto-commit script logs
tail -20 ~/.auto-commit.log
```

---

## 🔐 **Security Notes**

- ✅ SSH key: ED25519 (mạnh, hiện đại)
- ✅ Không cần token (SSH không hết hạn)
- ✅ Private key ở `~/.ssh/id_ed25519` (KHÔNG share!)
- ✅ Public key ở GitHub (safe để share)

---

## 📝 **Cách Thay Đổi**

Nếu cần sửa auto-commit:

### **Đổi interval (ví dụ: 30 phút)**
```bash
crontab -e
# Sửa: 0 * * * *  →  */30 * * * *
```

### **Đổi commit message**
Edit file: `~/chut-systems/auto-commit.sh`
```bash
git commit -m "Vault auto-save"  # Sửa dòng này
```

### **Tắt auto-commit tạm thời**
```bash
crontab -e
# Comment dòng: # 0 * * * * ~/chut-systems/auto-commit.sh
```

---

## ✅ **Checklist Setup**

- [x] SSH key created (`~/.ssh/id_ed25519`)
- [x] SSH key added to GitHub
- [x] Git repo initialized (`~/chut-systems/`)
- [x] Remote set to SSH
- [x] Auto-commit script created
- [x] Cron job added
- [x] Test push successful
- [x] Auto-sync working

---

## 🎯 **Next Steps**

1. **Monitor logs** → `tail ~/.auto-commit.log`
2. **Check GitHub** → Verify commits appear
3. **Edit files** → Make changes in Obsidian
4. **Wait 1 hour** → See auto-sync in action

---

**Setup Date**: 2026-04-17  
**Last Updated**: 2026-04-17  
**Status**: ✅ Active & Working  

---

**Questions?** Check `[[Life/Context/Hệ Thống Lưu Context.md]]` or troubleshoot above!

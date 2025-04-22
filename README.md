# 🚀 Flashcard Vocabulary – Expo App

Welcome to the Flashcard Vocabulary learning app built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev). This project supports **offline vocabulary learning**, and follows a clean Git workflow for team collaboration.

---

## ✅ Get Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Binh1012/Vocabulary-Learning-by-PlashCard.git
   cd flashcard-vocab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npx expo start
   ```

You can run it on:
- [Expo Go](https://expo.dev/go)
- Android Emulator
- iOS Simulator
- Development build
- WebStorm (Using)

---

## 🧠 Project Structure

```bash
app/
├── index.tsx               # Entry point
├── _layout.tsx             # App-wide layout
├── screens/                # Feature screens (Login, SignUp, Start)
├── components/             # Reusable UI components
├── assets/                 # Images, fonts, etc.
```

---

## 🔀 Git Workflow (Team Guide)

### 1. **Git Branching Strategy**
| Mục đích                           | Câu lệnh                                          |
|-----------------------------------|--------------------------------------------------|
| Bắt đầu task mới từ `develop`     | `git checkout develop && git pull`               |
| Tạo nhánh tính năng mới           | `git checkout -b feature/sc-12-add-login-form`   |
| Muốn thay toàn bộ `main` theo nhánh khác | `git checkout main && git reset --hard feature/xyz && git push origin main --force` |

### 2. **Commit Message Convention**
```bash
<type>:  Nội dung rõ ràng
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `chore`

📌 Ví dụ:
```bash
feat: Add login UI and navigation
```

### 3. **Code Review & Pull Request**
- Tạo PR từ `feature/...` → `develop`
- Đặt tên PR: `Mô tả`
- Reviewer kiểm tra: rõ ràng, không bug, phạm vi đúng
- Merge dùng **Squash & Merge** để gọn commit

### 4. **Xử lý Conflict**
```bash
git checkout feature/your-branch
git pull origin develop
# Resolve conflicts, rồi:
git add .
git commit -m "fix: resolve merge conflict"
git push
```

---

## ❓ Q&A (Tóm tắt các nguyên tắc Git)

| Câu hỏi                                          | Trả lời ngắn gọn                                                                 |
|--------------------------------------------------|----------------------------------------------------------------------------------|
| **What is your git branching strategy?**         | Dùng `develop` chính, các nhánh `feature/...` để phát triển, `main` để release. |
| **How do you control commit messages?**          | Theo mẫu: `type: nội dung`, dùng `feat`, `fix`,... để dễ đọc và trace.     |
| **How do you do code reviews and pull requests?**| PR từ `feature` → `develop`, có tên rõ ràng, reviewer check kỹ rồi squash merge.|
| **How do you handle conflicts?**                 | Kéo `develop`, resolve conflict, commit lại và push tiếp tục PR.                 |

---

## 📦 Reset Project

Khi muốn làm mới toàn bộ project:
```bash
npm run reset-project
```

---

## 📚 Learn More

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)

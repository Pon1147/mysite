# 💖 Love Puzzle – Ghép Nối Tình Yêu

**Món quà sinh nhật 19 tuổi dành tặng em (30/04/2027)**

---

## 🎮 Game Overview

* **Tên game:** Ghép Nối Tình Yêu – *Love Jigsaw Puzzle*
* **Phong cách:** Lãng mạn, dễ thương, mobile-first
* **Trải nghiệm:** Nhẹ nhàng, cảm xúc, mang tính cá nhân

> Anh đã cắt nhỏ những khoảnh khắc đẹp nhất của chúng ta thành từng mảnh ghép.
> Em là người duy nhất có thể ghép lại để khám phá hết tình yêu anh dành cho em.

---

## 💡 Concept

* **Chủ đề:** *“Ghép Nối Tình Yêu”*
* **Số level:** 5
* **Mục tiêu:**
  Hoàn thành toàn bộ levels → mở khóa **Dashboard chọn quà đặc biệt**

---

## 🧩 Levels Design

| Level | Tên                              | Grid | Độ khó     | Phần thưởng                      |
| ----- | -------------------------------- | ---- | ---------- | -------------------------------- |
| 1     | Tin nhắn đầu tiên                | 4×4  | Dễ         | Lời nhắn ngọt ngào + hiệu ứng ❤️ |
| 2     | First date cùng nhau             | 5×5  | Dễ         | Audio voice anh kể lại           |
| 3     | Tấm hình chung đầu tiên          | 6×6  | Trung bình | Thư tình hiện dần                |
| 4     | Em trong mắt anh                 | 6×6  | Trung bình | Hiệu ứng đặc biệt + nhạc nền     |
| 5     | Em là điều tuyệt vời nhất anh có | 7×7  | Khó        | 🎥 Video chúc mừng + Dashboard   |

---

## ⚙️ Core Gameplay

* Drag & Drop mượt (Pointer Events – mobile optimized)
* Snap tự động khi khoảng cách < **20px**
* **Hint:** 3 lần / level (highlight 1 mảnh đúng)
* Timer hiển thị thời gian hoàn thành
* Nhạc nền (toggle on/off)
* Hiệu ứng **confetti** khi hoàn thành
* Lưu tiến độ bằng **localStorage**

---

## 🎁 Final Reward – Dashboard

Sau khi hoàn thành Level 5:

### 💝 “Món quà dành cho em”

* 5–6 lựa chọn:

  * 🎁 Quà vật lý (hoa, quà tặng…)
  * 🍽️ Trải nghiệm (date, ăn tối, xem phim…)
  * 💻 Kỹ thuật số (playlist, video, ảnh…)

* Cho phép:

  * Chọn **1 hoặc nhiều món**
  * Gửi lựa chọn qua:

    * Telegram
    * Zalo

---

## 🧱 Tech Stack (Mỳ Ăn Liền)

| Phần          | Công nghệ               | Lý do                |
| ------------- | ----------------------- | -------------------- |
| Bundler       | Vite                    | Build cực nhanh      |
| Language      | TypeScript + Vanilla JS | An toàn, dễ maintain |
| Styling       | SCSS                    | Linh hoạt            |
| Puzzle Engine | HTML5 Canvas            | Mượt trên mobile     |
| Effects       | canvas-confetti         | Nhẹ                  |
| Audio         | Native Audio API        | Đơn giản             |
| Storage       | localStorage            | Lưu progress         |
| Deploy        | Vercel                  | 1-click deploy       |

---

## 📁 Project Structure

```bash
love-puzzle-birthday/
├── index.html
├── vite.config.js
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── game/
│   │   ├── Puzzle.ts
│   │   ├── PuzzleRenderer.ts
│   │   ├── PuzzleDrag.ts
│   │   └── types.ts
│   ├── ui/
│   │   ├── LevelScreen.ts
│   │   ├── Dashboard.ts
│   │   └── RomanticOverlay.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── timer.ts
│   │   ├── confetti.ts
│   │   └── audio.ts
│   └── content/
│       └── romantic-content.ts
├── public/assets/
│   ├── images/
│   ├── audio/
│   └── video/
└── styles/style.scss
```

---

## 📱 Mobile-First Checklist (Bắt buộc)

* Viewport meta + responsive layout
* Canvas max **640px**, giữ tỷ lệ ảnh
* Pointer Events cho drag & drop
* `touch-action: none` + disable scroll khi drag
* Safe area cho iPhone
* Button ≥ **44px**

## ⚠️ Nguyên tắc “Mỳ Ăn Liền”

* Ưu tiên **trải nghiệm & cảm xúc**
* Tránh over-engineering
* Code **đủ sạch để maintain**
* Mục tiêu: **Ship nhanh + đẹp + ý nghĩa**

---

## 🎯 Final Note

Đây không chỉ là một mini game.
Đây là một trải nghiệm cá nhân hóa — nơi từng mảnh ghép là một ký ức,
và người chơi chính là người hoàn thiện câu chuyện.

---

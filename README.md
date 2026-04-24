# 🎂 Happy Birthday My Love - 30/04/2027
**Website sinh nhật đặc biệt dành tặng em ❤️**

Trang web tình yêu dưới dạng **trò chơi ghép hình** (Jigsaw Puzzle) – món quà ý nghĩa nhất từ anh.

---

## 🌟 Giới thiệu

Sinh nhật em lần thứ **19** (30/04/2007).  
Anh muốn biến ngày đặc biệt này thành một hành trình ngọt ngào, nơi em phải tự tay ghép những mảnh ký ức và tình cảm của chúng ta lại để khám phá hết tình yêu anh dành cho em.

**Concept chính:** "Ghép Nối Tình Yêu" – Love Jigsaw Puzzle Game

---

## 🎮 Concept & Ý tưởng

### Concept chính
- **Tên game**: Ghép Nối Tình Yêu
- **Cốt truyện**: Anh đã cắt nhỏ những khoảnh khắc đẹp nhất và những lời yêu thương sâu sắc nhất thành từng mảnh ghép. Em là người duy nhất có thể ghép lại để thấy bức tranh hoàn chỉnh của tình yêu.
- **Số level**: **5 levels**

| Level | Tên bức tranh                          | Độ khó | Phần thưởng khi hoàn thành                          |
|-------|----------------------------------------|--------|-----------------------------------------------------|
| 1     | Tin nhắn đầu tiên                      | Dễ     | Lời nhắn ngọt ngào + hiệu ứng trái tim              |
| 2     | First date cùng nhau                   | Dễ     | Audio voice anh kể lại                              |
| 3     | Tấm hình chung đầu tiên                | Trung  | Thư tình hiện dần                                   |
| 4     | Em trong mắt anh                       | Trung  | Hiệu ứng đặc biệt + nhạc nền lãng mạn              |
| 5     | Em là điều tuyệt vời nhất anh có       | Khó    | Video chúc mừng sinh nhật + **Mở Dashboard Chọn Quà** |

**Tính năng nổi bật:**
- Kéo thả ghép hình (drag & drop) mượt mà
- Hint giới hạn (3 lần/level)
- Timer + điểm số
- Hiệu ứng confetti + âm thanh click dễ thương
- Mobile friendly 100%
- Nhạc nền (có nút bật/tắt)
- Password bảo vệ
- **Dashboard chọn quà** khi hoàn thành tất cả levels (rất hay như anh nói ❤️)

### Ý tưởng Dashboard Chọn Quà (Final Reward)
Khi em ghép xong Level 5, sẽ hiện ra một trang **"Món quà dành cho em"** với các lựa chọn:
- Quà vật lý (hoa, quà tặng, date plan…)
- Quà trải nghiệm (đi chơi, ăn tối, xem phim…)
- Quà kỹ thuật số (ảnh ghép, video dài, playlist…)
- Em được chọn 1 hoặc nhiều món anh sẽ thực hiện

---

## 🛠 Công nghệ & Tech Stack

- **HTML5 + SCSS + Vanilla JavaScript**
- Thư viện: Canvas puzzle, canvas-confetti, Howler.js
- Responsive + Mobile-first

**Deploy**: Vercel / Netlify

---

## 📋 Technical Plan (Đang thực hiện)

### Phase 1: Setup (Hoàn thành)
- [x] Cấu trúc dự án + SCSS
- [x] UI/UX + 5 ảnh levels
- [x] README cập nhật

### Phase 2: Core Features (Đang làm)
- [ ] Hệ thống puzzle 5 levels
- [ ] Win condition + confetti
- [ ] Hint, Timer, Progress
- [ ] **Dashboard chọn quà** sau Level 5

### Phase 3: Romantic Content
- [ ] Lời nhắn, audio, video, thư tình từng level
- [ ] Password + Dashboard quà tặng

### Phase 4: Polish & Test
- [ ] Test mobile + deploy

**Tổng thời gian ước tính:** 7-10 ngày (part-time)

---

## 🚀 Roadmap

- **v1.0 (30/04/2026)**: 5 levels + Dashboard chọn quà hoàn chỉnh
- **v1.1**: Thêm animation mượt + nhiều lựa chọn quà
- **v1.2**: Mini-game bổ sung (tùy chọn)

---

## 📁 Cấu trúc thư mục hiện tại

```markdown
love-puzzle-birthday/
├── index.html
├── css/style.css
├── scss/ (style.scss + partials)
├── js/
│   ├── main.js
│   ├── puzzle.js
│   └── confetti.js
├── assets/
│   ├── images/ (level_1.jpg → level_5.jpg)
│   ├── audio/
│   └── video/
├── README.md
├── package.json
└── .gitignore
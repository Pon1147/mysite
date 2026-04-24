// ==================== MAIN.JS - Ghép Nối Tình Yêu ====================

let currentLevel = 1;
let passwordCorrect = false;

// ==================== PASSWORD SYSTEM ====================
function checkPassword() {
    const input = document.getElementById('password-input');
    const enteredPassword = input.value.trim();

    // TODO: Anh sẽ cho mình biết mật khẩu chính xác
    const correctPassword = "1903";   // ← Anh phải điền vào đây

    if (enteredPassword === correctPassword) {
        passwordCorrect = true;
        document.getElementById('password-screen').classList.remove('active');
        document.getElementById('main-screen').classList.add('active');
        
        // Tạo các level card
        createLevelCards();
        
        // Phát nhạc nền (sẽ config sau)
        console.log("🎉 Mật khẩu đúng! Chào mừng em đến với món quà của anh.");
    } else {
        input.style.borderColor = '#ff0000';
        input.value = '';
        input.placeholder = 'Sai rồi, thử lại nhé ❤️';
        
        setTimeout(() => {
            input.style.borderColor = '#ff4d94';
            input.placeholder = 'ddmm (ngày quen nhau)';
        }, 2000);
    }
}

// ==================== TẠO LEVEL CARDS ====================
function createLevelCards() {
    const grid = document.querySelector('.levels-grid');
    grid.innerHTML = '';

    const levels = [
        { num: 1, title: "Ngày đầu gặp nhau", difficulty: "Dễ" },
        { num: 2, title: "Kỷ niệm đáng nhớ nhất", difficulty: "Dễ" },
        { num: 3, title: "Em trong mắt anh", difficulty: "Trung bình" },
        { num: 4, title: "Tương lai của chúng ta", difficulty: "Trung bình" }
    ];

    levels.forEach(level => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.dataset.level = level.num;
        card.innerHTML = `
            <div class="level-number">Level ${level.num}</div>
            <h3>${level.title}</h3>
            <span class="difficulty">${level.difficulty}</span>
            <button onclick="startLevel(${level.num})">Bắt đầu ghép</button>
        `;
        grid.appendChild(card);
    });
}

// ==================== PLACEHOLDER - Sẽ code sau ====================
function startLevel(level) {
    console.log(`Bắt đầu Level ${level}`);
    alert(`Đang mở Level ${level}...\n\n(Mình sẽ code puzzle sau khi anh xác nhận một số thông tin)`);
}

// Event listener cho Enter trên password
document.addEventListener('DOMContentLoaded', () => {
    const pwInput = document.getElementById('password-input');
    pwInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});
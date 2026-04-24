// ==================== MAIN.JS - Ghep Noi Tinh Yeu ====================

const totalLevels = 5;
const maxHintsPerLevel = 3;
const correctPassword = "1903"; // TODO: replace with your real password
const STORAGE_KEY = "lovePuzzleProgressV1";
const COMPLETE_HOLD_MS = 5000;
const ZALO_PHONE = "0903082908";

const levelData = [
    { num: 1, title: "Tin nhan dau tien", difficulty: "De" },
    { num: 2, title: "First date cung nhau", difficulty: "De" },
    { num: 3, title: "Tam hinh chung dau tien", difficulty: "Trung binh" },
    { num: 4, title: "Em trong mat anh", difficulty: "Trung binh" },
    { num: 5, title: "Em la dieu tuyet voi nhat anh co", difficulty: "Kho" }
];

let currentLevel = 1;
let completedLevels = 0;
let timerInterval = null;
let levelStartTime = 0;
let hintsRemaining = maxHintsPerLevel;
let selectedGiftTitles = [];
let bgMusic = null;

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);
        completedLevels = Math.max(0, Math.min(totalLevels, Number(parsed.completedLevels) || 0));
        selectedGiftTitles = Array.isArray(parsed.selectedGiftTitles)
            ? parsed.selectedGiftTitles.filter((x) => typeof x === "string")
            : [];
    } catch (_) {
        completedLevels = 0;
        selectedGiftTitles = [];
    }
}

function saveProgress() {
    const payload = {
        completedLevels,
        selectedGiftTitles
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");

    if (screenId === "dashboard-screen") {
        syncGiftSelectionUI();
    }
}

function checkPassword() {
    const input = document.getElementById("password-input");
    const entered = input.value.trim();

    if (entered === correctPassword) {
        input.value = "";
        showScreen("main-screen");
        createLevelCards();
        return;
    }

    input.style.borderColor = "#ff3b30";
    input.value = "";
    input.placeholder = "Sai mat khau, thu lai nhe";
    setTimeout(() => {
        input.style.borderColor = "#ff4d94";
        input.placeholder = "ddmm (ngay quen nhau)";
    }, 1800);
}

function createLevelCards() {
    const grid = document.querySelector(".levels-grid");
    const unlockedLevel = completedLevels + 1;

    grid.innerHTML = `
        <div class="progress-wrap">
            <div class="progress-label">Tien do: ${completedLevels}/${totalLevels} level</div>
            <div class="progress-bar"><div class="progress" style="width:${(completedLevels / totalLevels) * 100}%"></div></div>
        </div>
    `;

    levelData.forEach((level) => {
        const isLocked = level.num > unlockedLevel;
        const isDone = level.num <= completedLevels;
        const card = document.createElement("div");
        card.className = `level-card ${isLocked ? "locked" : ""} ${isDone ? "done" : ""}`.trim();
        card.dataset.level = String(level.num);

        card.innerHTML = `
            <div class="level-number">L${level.num}</div>
            <h3>${level.title}</h3>
            <span class="difficulty">${level.difficulty}</span>
            <button onclick="startLevel(${level.num})" ${isLocked ? "disabled" : ""}>
                ${isDone ? "Choi lai" : (isLocked ? "Da khoa" : "Bat dau ghep")}
            </button>
        `;

        grid.appendChild(card);
    });
}

function updateHintButton() {
    const hintBtn = document.querySelector(".hint-btn");
    if (!hintBtn) return;
    hintBtn.textContent = `Hint (${hintsRemaining})`;
    hintBtn.disabled = hintsRemaining <= 0;
}

function startTimer() {
    const timerEl = document.getElementById("timer");
    levelStartTime = Date.now();
    stopTimer();

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - levelStartTime) / 1000);
        timerEl.textContent = formatTime(elapsed);
    }, 500);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function startLevel(level) {
    if (level > completedLevels + 1) return;

    currentLevel = level;
    hintsRemaining = maxHintsPerLevel;

    const levelTitle = levelData[level - 1]?.title || `Level ${level}`;
    document.getElementById("level-title").textContent = `Level ${level} - ${levelTitle}`;
    document.getElementById("timer").textContent = "00:00";

    updateHintButton();
    showScreen("puzzle-screen");
    startTimer();
    window.initPuzzle(level);
}

function giveHint() {
    if (hintsRemaining <= 0) return;
    if (typeof window.showPuzzleHint !== "function") return;

    const didApplyHint = window.showPuzzleHint();
    if (didApplyHint) {
        hintsRemaining -= 1;
        updateHintButton();
    }
}

function backToMenu() {
    stopTimer();
    showScreen("main-screen");
    createLevelCards();
}

function completeLevel() {
    stopTimer();
    completedLevels = Math.max(completedLevels, currentLevel);
    saveProgress();

    setTimeout(() => {
        if (typeof window.triggerConfetti === "function") {
            window.triggerConfetti(140);
        }

        if (completedLevels >= totalLevels) {
            setTimeout(showFinalDashboard, 600);
            return;
        }

        alert(`Hoan thanh Level ${currentLevel}!`);
        showScreen("main-screen");
        createLevelCards();
    }, COMPLETE_HOLD_MS);
}

function showFinalDashboard() {
    showScreen("dashboard-screen");
    if (typeof window.triggerConfetti === "function") {
        setTimeout(() => window.triggerConfetti(220), 250);
        setTimeout(() => window.triggerConfetti(260), 950);
    }
}

function syncGiftSelectionUI() {
    document.querySelectorAll(".gift-card").forEach((card) => {
        const title = card.querySelector("h3")?.textContent?.trim() || "";
        card.classList.toggle("selected", selectedGiftTitles.includes(title));
    });
}

function selectGift(cardElement) {
    const title = cardElement.querySelector("h3")?.textContent?.trim();
    if (!title) return;

    if (selectedGiftTitles.includes(title)) {
        selectedGiftTitles = selectedGiftTitles.filter((x) => x !== title);
    } else {
        selectedGiftTitles.push(title);
    }

    saveProgress();
    syncGiftSelectionUI();
}

function buildGiftMessage() {
    if (!selectedGiftTitles.length) return "";
    return `Em chon cac mon qua nay:\n- ${selectedGiftTitles.join("\n- ")}`;
}

function shareGifts(platform) {
    if (!selectedGiftTitles.length) {
        alert("Hay chon it nhat 1 mon qua truoc nhe.");
        return;
    }

    if (platform === "zalo") {
        const text = buildGiftMessage();
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).catch(() => {});
        }
        window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank", "noopener,noreferrer");
        alert("Da mo Zalo 0903082908 va copy noi dung mon qua. Ban chi can paste de gui.");
    }
}

function initMusicControl() {
    const musicBtn = document.getElementById("music-btn");
    if (!musicBtn) return;

    bgMusic = new Audio("assets/audio/bg-music.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.45;

    let isOn = false;

    musicBtn.addEventListener("click", async () => {
        if (!bgMusic) return;

        if (!isOn) {
            try {
                await bgMusic.play();
                isOn = true;
                musicBtn.textContent = "Nhac nen: ON";
            } catch (_) {
                alert("Chua mo duoc nhac. Hay kiem tra file assets/audio/bg-music.mp3");
            }
            return;
        }

        bgMusic.pause();
        isOn = false;
        musicBtn.textContent = "Nhac nen: OFF";
    });
}

function restartGame() {
    completedLevels = 0;
    currentLevel = 1;
    hintsRemaining = maxHintsPerLevel;
    selectedGiftTitles = [];
    saveProgress();
    showScreen("main-screen");
    createLevelCards();
}

document.addEventListener("DOMContentLoaded", () => {
    loadProgress();
    initMusicControl();

    const pwInput = document.getElementById("password-input");
    pwInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") checkPassword();
    });
});

window.checkPassword = checkPassword;
window.startLevel = startLevel;
window.completeLevel = completeLevel;
window.backToMenu = backToMenu;
window.giveHint = giveHint;
window.selectGift = selectGift;
window.restartGame = restartGame;
window.shareGifts = shareGifts;

window.addEventListener("resize", () => {
    if (document.getElementById("puzzle-screen").classList.contains("active")) {
        window.initPuzzle(currentLevel);
    }
});

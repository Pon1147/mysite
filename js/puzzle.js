// ==================== PUZZLE.JS - Split Board + Piece Bank ====================

let cols = 4;
let rows = 4;
let currentLevel = 1;
let imageUrl = "";

let boardWidth = 320;
let boardHeight = 520;
let pieceWidth = 80;
let pieceHeight = 80;

let pieces = [];
let lockedCount = 0;

let pieceBankEl;
let boardEl;

function initPuzzle(level) {
    currentLevel = level;
    pieceBankEl = document.getElementById("piece-bank");
    boardEl = document.getElementById("puzzle-board");

    if (!pieceBankEl || !boardEl) return;

    if (level <= 2) {
        cols = 4;
        rows = 4;
    } else if (level <= 4) {
        cols = 5;
        rows = 5;
    } else {
        cols = 6;
        rows = 6;
    }

    imageUrl = `assets/images/level_${level}.jpg`;
    renderPuzzle(1080, 1920);
    loadImageDimensions(imageUrl).then(({ width, height }) => {
        renderPuzzle(width, height);
    });
}

function renderPuzzle(naturalWidth, naturalHeight) {
    computeBoardSize(naturalWidth, naturalHeight);
    buildBoard();
    buildPieces();
}

function loadImageDimensions(url) {
    return new Promise((resolve) => {
        const img = new Image();
        let done = false;

        const finish = (width, height) => {
            if (done) return;
            done = true;
            resolve({ width, height });
        };

        const timeoutId = setTimeout(() => {
            finish(1080, 1920);
        }, 2500);

        img.onload = () => {
            clearTimeout(timeoutId);
            const width = img.naturalWidth || 1080;
            const height = img.naturalHeight || 1920;
            finish(width, height);
        };

        img.onerror = () => {
            clearTimeout(timeoutId);
            finish(1080, 1920);
        };

        img.src = url;
    });
}

function computeBoardSize(naturalWidth, naturalHeight) {
    const safeWidth = naturalWidth > 0 ? naturalWidth : 1080;
    const safeHeight = naturalHeight > 0 ? naturalHeight : 1920;
    const ratio = safeWidth / safeHeight;
    const boardWidthRatio = window.innerWidth <= 768 ? 0.9 : 0.42;
    const maxBoardWidth = Math.min(window.innerWidth * boardWidthRatio, 520);
    const maxBoardHeight = Math.min(window.innerHeight * 0.58, 680);

    let targetWidth = maxBoardWidth;
    let targetHeight = targetWidth / ratio;

    if (targetHeight > maxBoardHeight) {
        targetHeight = maxBoardHeight;
        targetWidth = targetHeight * ratio;
    }

    const proposedBoardWidth = Math.max(220, Math.round(targetWidth));
    const proposedBoardHeight = Math.max(280, Math.round(targetHeight));

    pieceWidth = Math.max(28, Math.floor(proposedBoardWidth / cols));
    pieceHeight = Math.max(36, Math.floor(proposedBoardHeight / rows));
    boardWidth = pieceWidth * cols;
    boardHeight = pieceHeight * rows;
}

function buildBoard() {
    boardEl.innerHTML = "";
    boardEl.style.width = `${boardWidth}px`;
    boardEl.style.height = `${boardHeight}px`;
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
            const slot = document.createElement("div");
            slot.className = "board-slot";
            slot.dataset.row = String(row);
            slot.dataset.col = String(col);

            slot.addEventListener("dragover", (event) => {
                event.preventDefault();
                slot.classList.add("can-drop");
            });
            slot.addEventListener("dragleave", () => slot.classList.remove("can-drop"));
            slot.addEventListener("drop", (event) => handleDrop(event, slot));

            boardEl.appendChild(slot);
        }
    }
}

function buildPieces() {
    pieces = [];
    lockedCount = 0;
    pieceBankEl.innerHTML = "";

    const sourceOrder = [];
    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
            sourceOrder.push({ row, col });
        }
    }

    for (let i = sourceOrder.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [sourceOrder[i], sourceOrder[j]] = [sourceOrder[j], sourceOrder[i]];
    }

    sourceOrder.forEach(({ row, col }, index) => {
        const id = `piece-${currentLevel}-${index}`;
        pieces.push({ id, row, col, locked: false });
        pieceBankEl.appendChild(createPieceElement(id, row, col));
    });

    pieceBankEl.style.gridTemplateColumns = `repeat(${Math.min(cols, 4)}, ${Math.round(pieceWidth)}px)`;
}

function createPieceElement(id, row, col) {
    const piece = document.createElement("div");
    piece.id = id;
    piece.className = "puzzle-piece";
    piece.draggable = true;
    piece.dataset.row = String(row);
    piece.dataset.col = String(col);

    piece.style.width = `${Math.round(pieceWidth)}px`;
    piece.style.height = `${Math.round(pieceHeight)}px`;
    piece.style.backgroundImage = `url("${imageUrl}")`;
    piece.style.backgroundSize = `${boardWidth}px ${boardHeight}px`;
    piece.style.backgroundPosition = `${-col * pieceWidth}px ${-row * pieceHeight}px`;
    piece.style.backgroundColor = "#ffeef7";

    piece.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/piece-id", id);
        piece.classList.add("dragging");
    });

    piece.addEventListener("dragend", () => {
        piece.classList.remove("dragging");
    });

    return piece;
}

function handleDrop(event, slot) {
    event.preventDefault();
    slot.classList.remove("can-drop");

    const pieceId = event.dataTransfer.getData("text/piece-id");
    if (!pieceId) return;

    const piece = document.getElementById(pieceId);
    if (!piece) return;
    if (piece.classList.contains("locked")) return;

    const pieceRow = Number(piece.dataset.row);
    const pieceCol = Number(piece.dataset.col);
    const slotRow = Number(slot.dataset.row);
    const slotCol = Number(slot.dataset.col);

    if (pieceRow === slotRow && pieceCol === slotCol) {
        lockPieceIntoSlot(piece, slot);
        return;
    }

    slot.classList.add("wrong-drop");
    setTimeout(() => slot.classList.remove("wrong-drop"), 260);
}

function lockPieceIntoSlot(piece, slot) {
    piece.classList.add("locked");
    piece.draggable = false;

    slot.innerHTML = "";
    slot.classList.add("filled");
    slot.appendChild(piece);

    piece.style.width = "100%";
    piece.style.height = "100%";
    piece.style.margin = "0";
    piece.style.borderRadius = "0";
    piece.style.boxShadow = "none";
    piece.style.cursor = "default";

    const model = pieces.find((p) => p.id === piece.id);
    if (model && !model.locked) {
        model.locked = true;
        lockedCount += 1;
    }

    if (lockedCount === pieces.length) {
        window.completeLevel();
    }
}

function showPuzzleHint() {
    const next = pieces.find((piece) => !piece.locked);
    if (!next) return false;

    const selector = `.board-slot[data-row="${next.row}"][data-col="${next.col}"]`;
    const slot = boardEl.querySelector(selector);
    const pieceEl = document.getElementById(next.id);
    if (!slot || !pieceEl) return false;

    lockPieceIntoSlot(pieceEl, slot);
    return true;
}

window.initPuzzle = initPuzzle;
window.showPuzzleHint = showPuzzleHint;

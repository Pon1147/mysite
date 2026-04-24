// ==================== PUZZLE.JS - Split Board + Piece Bank ====================

let cols = 4;
let rows = 4;
let puzzleLevel = 1;
let imageUrl = "";

let boardWidth = 320;
let boardHeight = 520;
let pieceWidth = 80;
let pieceHeight = 80;
const SNAP_DISTANCE = 20;

let pieces = [];
let lockedCount = 0;
let activeDrag = null;

let pieceBankEl;
let boardEl;

function getGridByLevel(level) {
    if (level === 1) return 4;
    if (level === 2) return 5;
    if (level === 3 || level === 4) return 6;
    return 7;
}

function initPuzzle(level) {
    puzzleLevel = level;
    pieceBankEl = document.getElementById("piece-bank");
    boardEl = document.getElementById("puzzle-board");

    if (!pieceBankEl || !boardEl) return;

    const grid = getGridByLevel(level);
    cols = grid;
    rows = grid;

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
    const boardWidthRatio = window.innerWidth <= 768 ? 0.92 : 0.44;
    const maxBoardWidth = Math.min(window.innerWidth * boardWidthRatio, 640);
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
        const id = `piece-${puzzleLevel}-${index}`;
        pieces.push({ id, row, col, locked: false });
        pieceBankEl.appendChild(createPieceElement(id, row, col));
    });

    pieceBankEl.style.gridTemplateColumns = `repeat(${Math.min(cols, 4)}, ${Math.round(pieceWidth)}px)`;
    pieceBankEl.style.width = `${boardWidth}px`;
}

function createPieceElement(id, row, col) {
    const piece = document.createElement("div");
    piece.id = id;
    piece.className = "puzzle-piece";
    piece.draggable = false;
    piece.dataset.row = String(row);
    piece.dataset.col = String(col);

    piece.style.width = `${Math.round(pieceWidth)}px`;
    piece.style.height = `${Math.round(pieceHeight)}px`;
    piece.style.backgroundImage = `url("${imageUrl}")`;
    piece.style.backgroundSize = `${boardWidth}px ${boardHeight}px`;
    piece.style.backgroundPosition = `${-col * pieceWidth}px ${-row * pieceHeight}px`;
    piece.style.backgroundColor = "#ffeef7";

    piece.addEventListener("pointerdown", (event) => startPointerDrag(event, piece));

    return piece;
}

function startPointerDrag(event, piece) {
    if (piece.classList.contains("locked")) return;

    event.preventDefault();
    const rect = piece.getBoundingClientRect();
    const targetSlot = boardEl.querySelector(
        `.board-slot[data-row="${piece.dataset.row}"][data-col="${piece.dataset.col}"]`
    );

    activeDrag = {
        piece,
        pointerId: event.pointerId,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        baseLeft: rect.left,
        baseTop: rect.top,
        targetLeft: rect.left,
        targetTop: rect.top,
        rafId: 0,
        targetSlot,
        originParent: piece.parentElement,
        originNextSibling: piece.nextSibling
    };

    piece.classList.add("dragging");
    piece.style.position = "fixed";
    piece.style.left = `${rect.left}px`;
    piece.style.top = `${rect.top}px`;
    piece.style.transform = "translate3d(0,0,0)";
    piece.style.zIndex = "9999";
    piece.style.margin = "0";
    piece.style.pointerEvents = "none";

    document.body.appendChild(piece);
    document.body.classList.add("dragging-piece");

    if (typeof piece.setPointerCapture === "function") {
        try {
            piece.setPointerCapture(event.pointerId);
        } catch (_) {}
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
    window.addEventListener("pointercancel", onPointerUp, { once: true });
}

function onPointerMove(event) {
    if (!activeDrag) return;
    if (event.pointerId !== activeDrag.pointerId) return;

    activeDrag.targetLeft = event.clientX - activeDrag.offsetX;
    activeDrag.targetTop = event.clientY - activeDrag.offsetY;

    if (!activeDrag.rafId) {
        activeDrag.rafId = window.requestAnimationFrame(applyDragPosition);
    }

    updateTargetSlotFeedback(event.clientX, event.clientY);
}

function applyDragPosition() {
    if (!activeDrag) return;

    const deltaX = activeDrag.targetLeft - activeDrag.baseLeft;
    const deltaY = activeDrag.targetTop - activeDrag.baseTop;
    activeDrag.piece.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    activeDrag.rafId = 0;
}

function updateTargetSlotFeedback(clientX, clientY) {
    if (!activeDrag?.targetSlot) return;

    const distance = getDistanceToSlotCenter(activeDrag.targetSlot, clientX, clientY);
    activeDrag.targetSlot.classList.toggle("can-drop", distance <= SNAP_DISTANCE);
}

function onPointerUp(event) {
    if (!activeDrag) return;
    if (event.pointerId !== activeDrag.pointerId) return;

    const { piece, originParent, originNextSibling, targetSlot, rafId } = activeDrag;
    if (rafId) {
        window.cancelAnimationFrame(rafId);
    }
    piece.style.transform = `translate3d(${activeDrag.targetLeft - activeDrag.baseLeft}px, ${activeDrag.targetTop - activeDrag.baseTop}px, 0)`;
    activeDrag = null;

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointercancel", onPointerUp);
    piece.classList.remove("dragging");
    document.body.classList.remove("dragging-piece");
    if (targetSlot) {
        targetSlot.classList.remove("can-drop");
    }

    if (targetSlot) {
        const pieceRect = piece.getBoundingClientRect();
        const centerX = pieceRect.left + pieceRect.width / 2;
        const centerY = pieceRect.top + pieceRect.height / 2;
        const distance = getDistanceToSlotCenter(targetSlot, centerX, centerY);
        if (distance <= SNAP_DISTANCE) {
            lockPieceIntoSlot(piece, targetSlot);
            return;
        }
    }

    restorePieceToOrigin(piece, originParent, originNextSibling);
}

function getDistanceToSlotCenter(slot, x, y) {
    const rect = slot.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.hypot(x - centerX, y - centerY);
}

function restorePieceToOrigin(piece, originParent, originNextSibling) {
    piece.style.position = "";
    piece.style.left = "";
    piece.style.top = "";
    piece.style.transform = "";
    piece.style.zIndex = "";
    piece.style.pointerEvents = "";
    piece.style.width = `${Math.round(pieceWidth)}px`;
    piece.style.height = `${Math.round(pieceHeight)}px`;

    if (originParent) {
        if (originNextSibling && originNextSibling.parentNode === originParent) {
            originParent.insertBefore(piece, originNextSibling);
        } else {
            originParent.appendChild(piece);
        }
    } else {
        pieceBankEl.appendChild(piece);
    }
}

function lockPieceIntoSlot(piece, slot) {
    piece.classList.add("locked");

    slot.innerHTML = "";
    slot.classList.add("filled");
    slot.appendChild(piece);

    piece.style.position = "";
    piece.style.left = "";
    piece.style.top = "";
    piece.style.transform = "";
    piece.style.zIndex = "";
    piece.style.pointerEvents = "";
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

    pieceEl.classList.add("hint-piece");
    slot.classList.add("hint-slot");

    setTimeout(() => {
        pieceEl.classList.remove("hint-piece");
        slot.classList.remove("hint-slot");
    }, 1200);

    return true;
}

window.initPuzzle = initPuzzle;
window.showPuzzleHint = showPuzzleHint;

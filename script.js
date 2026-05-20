// ---------- GAME STATE ----------
let holes = [];          // stores each hole element
let activeMoleIndex = null;   // current hole index where mole is visible
let score = 0;
let missCount = 0;
let gameActive = true;
let gameInterval = null;
let currentIntervalMs = 650;   // matches default "NORMAL"

// DOM elements
const holesGrid = document.getElementById('holesGrid');
const scoreDisplay = document.getElementById('scoreDisplay');
const missDisplay = document.getElementById('missDisplay');
const difficultySelect = document.getElementById('difficultySelect');
const resetBtn = document.getElementById('resetGameBtn');
const gameMessageDiv = document.getElementById('gameMessage');

// Emoji collection (mole variations for fun)
const moleEmojis = ['🐭', '🐹', '🐫', '🦫', '🐿️', '🦔', '🐀', '🐽', '🐻‍❄️'];

// Helper: update UI scores
function updateUI() {
    scoreDisplay.innerText = score;
    missDisplay.innerText = missCount;
}

// Show message with timeout clear
let msgTimeout = null;
function setTemporaryMessage(msg, isError = false) {
    if (msgTimeout) clearTimeout(msgTimeout);
    gameMessageDiv.innerHTML = msg;
    gameMessageDiv.style.color = isError ? "#ffbc9e" : "#f9eec1";
    msgTimeout = setTimeout(() => {
        if (gameActive) gameMessageDiv.innerHTML = "🐀🔨 Whack fast! Keep an eye on the mole!";
        else gameMessageDiv.innerHTML = "⛔ GAME OVER! Press NEW GAME ⛔";
        gameMessageDiv.style.color = "#ffe1a0";
    }, 1200);
}

// Clear current mole (if any) from DOM and reset active index
function hideMole() {
    if (activeMoleIndex !== null) {
        const prevHole = holes[activeMoleIndex];
        if (prevHole) {
            // clear the mole emoji
            prevHole.innerHTML = '';
            prevHole.classList.add('empty');
            prevHole.classList.remove('whack-flash');
        }
        activeMoleIndex = null;
    }
}

// Spawn a new random mole in a different hole
function spawnMole() {
    if (!gameActive) return;
    
    // remove current mole before spawning new one
    hideMole();
    
    // pick random hole (0-8)
    let newIndex = Math.floor(Math.random() * holes.length);
    const targetHole = holes[newIndex];
    if (!targetHole) return;
    
    // random emoji for variation
    const randomMoleEmoji = moleEmojis[Math.floor(Math.random() * moleEmojis.length)];
    // create mole span with class for styling
    const moleSpan = document.createElement('span');
    moleSpan.className = 'mole';
    moleSpan.innerText = randomMoleEmoji;
    moleSpan.setAttribute('data-hole-idx', newIndex);
    // add whack listener directly on the mole
    moleSpan.addEventListener('click', (e) => {
        e.stopPropagation();
        whackHandler(newIndex);
    });
    
    // clear hole and set new mole
    targetHole.innerHTML = '';
    targetHole.classList.remove('empty');
    targetHole.appendChild(moleSpan);
    activeMoleIndex = newIndex;
}

// whack action
function whackHandler(index) {
    if (!gameActive) {
        setTemporaryMessage("❌ Game over! Press New Game", true);
        return;
    }
    // check if whacked hole matches current active mole
    if (activeMoleIndex !== null && index === activeMoleIndex) {
        // SUCCESSFUL WHACK
        score++;
        updateUI();
        // play flash effect
        const currentHole = holes[activeMoleIndex];
        if (currentHole) {
            currentHole.classList.add('whack-flash');
            setTimeout(() => {
                if (currentHole) currentHole.classList.remove('whack-flash');
            }, 120);
        }
        setTemporaryMessage("💥 POW! +1 🎉", false);
        // immediately hide mole to prevent double whack
        hideMole();
    } else {
        // missed whack: clicked on empty or wrong hole
        if (activeMoleIndex !== null && index !== activeMoleIndex) {
            // wrong hole click => miss
            missCount++;
            updateUI();
            setTemporaryMessage("😫 Wrong hole! -1 miss", true);
            // add red flash to wrong hole
            const wrongHole = holes[index];
            if (wrongHole) {
                wrongHole.style.transition = '0.06s';
                wrongHole.style.backgroundColor = '#ab5c2e';
                setTimeout(() => {
                    if (wrongHole) wrongHole.style.backgroundColor = '';
                }, 120);
            }
            checkGameOver();
        } 
        else if (activeMoleIndex === null) {
            // click on empty hole when no mole anywhere -> no penalty
            setTemporaryMessage("👀 No mole here... wait for it!", false);
            const emptyHole = holes[index];
            if (emptyHole) {
                emptyHole.style.transform = 'scale(0.96)';
                setTimeout(() => { if(emptyHole) emptyHole.style.transform = ''; }, 100);
            }
        }
    }
    // if game ends due to miss, we stop further action
    if (!gameActive) return;
}

// Check game over condition
function checkGameOver() {
    if (missCount >= 15) {
        gameActive = false;
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        hideMole(); // remove any visible mole
        gameMessageDiv.innerHTML = "💀 GAME OVER 💀<br> ⚡ Press 'NEW GAME' to play again ⚡";
        gameMessageDiv.style.color = "#ffbc8c";
        setTemporaryMessage("❌ You missed 15 times! Game Over ❌", true);
        return true;
    }
    return false;
}

// Reset full game state
function resetGame() {
    // stop any ongoing interval
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    // reset variables
    gameActive = true;
    score = 0;
    missCount = 0;
    updateUI();
    
    // hide any mole and clean holes
    hideMole();
    // reset all holes to empty state
    for (let i = 0; i < holes.length; i++) {
        const hole = holes[i];
        hole.innerHTML = '';
        hole.classList.add('empty');
        hole.classList.remove('whack-flash');
    }
    
    // reattach hole click handlers
    attachHoleClickListeners();
    
    // get current selected difficulty
    currentIntervalMs = parseInt(difficultySelect.value, 10);
    // start the game loop: spawn mole repeatedly
    gameInterval = setInterval(() => {
        if (gameActive) {
            // if a mole is currently visible and user hasn't whacked it, it escapes
            if (activeMoleIndex !== null) {
                missCount++;
                updateUI();
                setTemporaryMessage("😵 Mole escaped! +1 miss", true);
                // remove the mole
                hideMole();
                // check game over after increment
                if (checkGameOver()) {
                    if (gameInterval) {
                        clearInterval(gameInterval);
                        gameInterval = null;
                    }
                    return;
                }
            }
            // spawn new mole if game still active
            if (gameActive) {
                spawnMole();
            } else {
                if (gameInterval) clearInterval(gameInterval);
            }
        }
    }, currentIntervalMs);
    
    gameMessageDiv.innerHTML = "🌟 NEW GAME! WHACK THOSE MOLES! 🌟";
    gameMessageDiv.style.color = "#ffe1a0";
    setTimeout(() => {
        if(gameActive) gameMessageDiv.innerHTML = "🐀🔨 Whack fast! Keep an eye on the mole!";
    }, 1800);
}

// function to attach click handlers on each hole container
function attachHoleClickListeners() {
    for (let i = 0; i < holes.length; i++) {
        const hole = holes[i];
        // remove old listeners by cloning
        const newHole = hole.cloneNode(true);
        hole.parentNode.replaceChild(newHole, hole);
        holes[i] = newHole;
        // re-add empty class if needed
        if (!newHole.querySelector('.mole')) {
            newHole.classList.add('empty');
        } else {
            newHole.classList.remove('empty');
        }
        // assign click event for the hole
        newHole.addEventListener('click', (e) => {
            if (!gameActive) return;
            const isMoleInside = newHole.querySelector('.mole') !== null;
            if (isMoleInside && activeMoleIndex === i) {
                whackHandler(i);
            } else {
                if (!isMoleInside) {
                    if(activeMoleIndex !== null){
                        missCount++;
                        updateUI();
                        setTemporaryMessage("💢 Miss! Hit the mole!", true);
                        newHole.style.backgroundColor = '#8b4a2a';
                        setTimeout(() => { if(newHole) newHole.style.backgroundColor = ''; }, 100);
                        checkGameOver();
                    } else {
                        setTemporaryMessage("👻 No mole anywhere! Wait...", false);
                    }
                }
            }
        });
    }
}

// Build the grid (3x3)
function buildGrid() {
    holesGrid.innerHTML = '';
    holes = [];
    for (let i = 0; i < 9; i++) {
        const holeDiv = document.createElement('div');
        holeDiv.className = 'hole empty';
        holeDiv.setAttribute('data-id', i);
        holesGrid.appendChild(holeDiv);
        holes.push(holeDiv);
    }
    attachHoleClickListeners();
}

// When difficulty changes
function onDifficultyChange() {
    resetGame();
}

// Event listeners
resetBtn.addEventListener('click', () => {
    resetGame();
});

difficultySelect.addEventListener('change', () => {
    currentIntervalMs = parseInt(difficultySelect.value, 10);
    resetGame();
});

// initialization
function init() {
    buildGrid();
    resetGame();
}

init();
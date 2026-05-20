# 🐭 Whack-a-Mole

A fun, fast-paced browser-based Whack-a-Mole game built with vanilla HTML, CSS, and JavaScript. Pop those moles before they escape — but watch your misses!

---

## 🎮 How to Play

1. Open `index.html` in any modern browser.
2. Moles pop up randomly across a 3×3 grid of holes.
3. **Click a mole** to whack it and earn a point.
4. If a mole **escapes** (timer runs out) or you **click the wrong hole**, you get a miss.
5. **15 misses = Game Over.**
6. Press **🔄 NEW GAME** at any time to restart.

---

## ⚙️ Features

- **4 difficulty levels** — Slow (0.9s), Normal (0.65s), Fast (0.45s), Insane (0.3s)
- **9 random mole variants** — different emoji critters keep it fresh
- **Live score & miss tracker** — always visible in the stats bar
- **Flash feedback** — visual cues for hits, misses, and wrong-hole clicks
- **Responsive layout** — playable on both desktop and mobile
- **Custom cursor** — a little pointer hammer for extra charm

---

## 🗂️ File Structure

```
whack-a-mole/
├── index.html   # Game markup and layout
├── style.css    # All visual styling, animations, and responsive rules
└── script.js    # Game logic: grid setup, mole spawning, scoring, intervals
```

---

## 🚀 Getting Started

No build tools or dependencies required — just plain HTML, CSS, and JS.

```bash
# Clone or download the repo, then open the file directly:
open index.html
# or double-click index.html in your file explorer
```

Works in all modern browsers (Chrome, Firefox, Edge, Safari).

---

## 🛠️ Customization

| What you want to change | Where to look |
|---|---|
| Mole emojis | `moleEmojis` array in `script.js` |
| Difficulty presets / timings | `<select>` in `index.html` + `currentIntervalMs` in `script.js` |
| Miss limit (default: 15) | `checkGameOver()` in `script.js` |
| Hole size / grid layout | `.hole` and `.holes-grid` in `style.css` |
| Color scheme | CSS gradients / variables in `style.css` |

---

## 📸 Preview

> A 3×3 grid of dark earthy holes sits on a warm wooden game board. Moles pop up with a bounce, and the player races to whack them before they vanish. Visual feedback flashes gold on a hit and red on a miss.

---

## 📄 License

MIT — free to use, modify, and share.

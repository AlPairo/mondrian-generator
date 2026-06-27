# Mondrian Style Generative Art — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a p5.js interactive generative art tool that creates compositions in the style of Piet Mondrian, with a full control panel (seed, resolution, palette, composition parameters) and PNG export. Deploy to a new GitHub repo.

**Architecture:** Single self-contained HTML file using p5.js 1.11.3 (CDN). Based on the `viewer.html` template from the p5js skill. The algorithm generates Mondrian-style neoplasticist compositions: recursive subdivision of the canvas into rectangles separated by black (or configurable) lines, with some cells filled with primary colors or left white/gray.

**Tech Stack:** p5.js 1.11.3, vanilla HTML/CSS/JS, GitHub CLI (`gh`).

---

## Files to Create

| File | Purpose |
|------|---------|
| `index.html` | Single self-contained HTML with embedded CSS and JS |
| `README.md` | Project description, usage, screenshot placeholder |
| `.gitignore` | Standard HTML/JS ignore |

---

## Task 1: Create Project Directory and Initialize Git

**Objective:** Set up the workspace and git repo.

**Files:**
- Create directory: `~/mondrian-generator/`
- Run: `cd ~/mondrian-generator && git init`

**Verification:** `git status` shows empty repo.

---

## Task 2: Implement `index.html` — Core Structure

**Objective:** Create the single-file app based on the p5js `viewer.html` template.

**File:** Create `~/mondrian-generator/index.html`

### Structure (keep from template):
- Sidebar (280px) + Canvas area (flex:1)
- Seed navigation (prev/next/random/jump)
- Actions (regenerate, reset defaults, download PNG)
- Responsive canvas sizing

### Parameters to expose in sidebar:

| Parameter | Control | Range / Type | Default |
|-----------|---------|-------------|---------|
| `seed` | Seed nav + jump | integer | 42 |
| `canvasSize` | Dropdown select | 600, 800, 1080, 1440, 1920 | 800 |
| `lineWeight` | Slider | 2 - 20 | 8 |
| `minCellSize` | Slider | 30 - 200 | 80 |
| `splitChance` | Slider | 0.1 - 0.9 | 0.65 |
| `colorProbability` | Slider | 0.0 - 1.0 | 0.35 |
| `red` | Color picker | hex | `#E60012` |
| `blue` | Color picker | hex | `#0055BF` |
| `yellow` | Color picker | hex | `#F6B800` |
| `lineColor` | Color picker | hex | `#111111` |
| `bgColor` | Color picker | hex | `#F4F4F4` |
| `grayColor` | Color picker | hex | `#D0D0D0` |
| `useGray` | Checkbox | boolean | false |

### CSS Notes:
- Use the exact sidebar/canvas-area styles from the template.
- Add a `select` style for the resolution dropdown.
- Keep dark theme (#0a0a0f background, #12121a sidebar).

### HTML Controls Code (replace the `#params-section`):

Add exactly these control groups inside `#params-section`:

1. **Resolution** — `<select id="canvasSize" onchange="updateParam('canvasSize', +this.value); resizeAndRegenerate()">` with options: 600, 800, 1080, 1440, 1920.
2. **Line Weight** — range 2-20, step 1.
3. **Min Cell Size** — range 30-200, step 10.
4. **Split Chance** — range 0.1-0.9, step 0.05.
5. **Color Probability** — range 0.0-1.0, step 0.05.
6. **Colors section** with 6 color pickers: red, blue, yellow, line color, bg color, gray color.
7. **Use Gray Cells** — checkbox.

### JavaScript Architecture:

```javascript
// === DEFAULTS ===
const DEFAULTS = {
  seed: 42,
  canvasSize: 800,
  lineWeight: 8,
  minCellSize: 80,
  splitChance: 0.65,
  colorProbability: 0.35,
  red: '#E60012',
  blue: '#0055BF',
  yellow: '#F6B800',
  lineColor: '#111111',
  bgColor: '#F4F4F4',
  grayColor: '#D0D0D0',
  useGray: false,
};
let PARAMS = { ...DEFAULTS };
```

**Helper functions to implement:**
- `resizeAndRegenerate()` — resizes canvas to `PARAMS.canvasSize` x `PARAMS.canvasSize`, then calls `regenerate()`.
- `regenerate()` — sets randomSeed and noiseSeed, clears canvas, calls `generateMondrian()`, calls `redraw()`.
- `downloadPNG()` — `saveCanvas('mondrian-seed-' + PARAMS.seed, 'png')`.

### The Mondrian Generation Algorithm:

Implement `generateMondrian()` which builds the composition recursively:

```javascript
let cells = [];

function generateMondrian() {
  cells = [];
  // Start with full canvas as one cell
  subdivide(0, 0, PARAMS.canvasSize, PARAMS.canvasSize);
  
  // Draw background
  background(PARAMS.bgColor);
  
  // Draw colored cells first (so lines sit on top)
  for (let c of cells) {
    if (c.color) {
      fill(c.color);
      noStroke();
      // Inset slightly so color doesn't bleed over the line
      let inset = PARAMS.lineWeight / 2;
      rect(c.x + inset, c.y + inset, c.w - inset * 2, c.h - inset * 2);
    }
  }
  
  // Draw grid lines
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight);
  
  // Draw all cell borders that are internal
  // Actually, simpler: draw all cell outlines
  for (let c of cells) {
    noFill();
    rect(c.x, c.y, c.w, c.h);
  }
}
```

**Recursive subdivision (`subdivide(x, y, w, h)`):**

```javascript
function subdivide(x, y, w, h) {
  // Base case: too small or random stop
  if (w < PARAMS.minCellSize * 2 && h < PARAMS.minCellSize * 2) {
    cells.push({ x, y, w, h, color: pickColor() });
    return;
  }
  if (w < PARAMS.minCellSize || h < PARAMS.minCellSize || random() > PARAMS.splitChance) {
    cells.push({ x, y, w, h, color: pickColor() });
    return;
  }
  
  // Decide split direction based on proportions
  // If much wider than tall, prefer vertical split
  // If much taller than wide, prefer horizontal split
  // Otherwise random
  let ratio = w / h;
  let splitVert;
  if (ratio > 1.8) splitVert = true;
  else if (ratio < 0.55) splitVert = false;
  else splitVert = random() > 0.5;
  
  if (splitVert && w > PARAMS.minCellSize) {
    // Split vertically: two columns
    let splitAt = random(PARAMS.minCellSize, w - PARAMS.minCellSize);
    // Add some "Mondrian-like" bias: prefer splits near 1/2, 1/3, 2/3
    let thirds = [w * 0.33, w * 0.5, w * 0.67];
    let closest = thirds.reduce((a, b) => Math.abs(b - splitAt) < Math.abs(a - splitAt) ? b : a);
    if (abs(splitAt - closest) < w * 0.1) splitAt = closest;
    
    subdivide(x, y, splitAt, h);
    subdivide(x + splitAt, y, w - splitAt, h);
  } else if (!splitVert && h > PARAMS.minCellSize) {
    // Split horizontally: two rows
    let splitAt = random(PARAMS.minCellSize, h - PARAMS.minCellSize);
    let thirds = [h * 0.33, h * 0.5, h * 0.67];
    let closest = thirds.reduce((a, b) => Math.abs(b - splitAt) < Math.abs(a - splitAt) ? b : a);
    if (abs(splitAt - closest) < h * 0.1) splitAt = closest;
    
    subdivide(x, y, w, splitAt);
    subdivide(x, y + splitAt, w, h - splitAt);
  } else {
    cells.push({ x, y, w, h, color: pickColor() });
  }
}
```

**Color picker (`pickColor()`):**

```javascript
function pickColor() {
  if (random() > PARAMS.colorProbability) {
    // No color (leave as background, will show through)
    return null;
  }
  let palette = [PARAMS.red, PARAMS.blue, PARAMS.yellow];
  if (PARAMS.useGray) {
    palette.push(PARAMS.grayColor);
  }
  return random(palette);
}
```

### `setup()`:

```javascript
function setup() {
  let container = document.getElementById('canvas-container');
  let size = Math.min(container.clientWidth - 40, container.clientHeight - 40, PARAMS.canvasSize);
  let cnv = createCanvas(size, size);
  cnv.parent('canvas-container');
  pixelDensity(1);
  
  randomSeed(PARAMS.seed);
  noiseSeed(PARAMS.seed);
  generateMondrian();
  noLoop();
}
```

### `draw()`:

```javascript
function draw() {
  // All drawing happens in generateMondrian()
  // draw() is just the hook
}
```

### `windowResized()`:

```javascript
function windowResized() {
  let container = document.getElementById('canvas-container');
  let size = Math.min(container.clientWidth - 40, container.clientHeight - 40, PARAMS.canvasSize);
  resizeCanvas(size, size);
  regenerate();
}
```

**Verification:** Open `index.html` in browser. Should show a Mondrian-style grid with colored rectangles. Seed navigation should change composition. Parameters should update live.

---

## Task 3: Add README.md

**Objective:** Basic project documentation.

**File:** Create `~/mondrian-generator/README.md`

Content:
```markdown
# Mondrian Generator

Generative art tool that creates compositions in the style of Piet Mondrian.

## Features

- Adjustable canvas resolution
- Seed-based reproducible compositions
- Customizable color palette (red, blue, yellow, line, background, gray)
- Control line weight, minimum cell size, split probability, color probability
- Toggle gray cells
- Download compositions as PNG

## Usage

Open `index.html` in any modern browser. No build step required.

## Parameters

| Parameter | Description |
|-----------|-------------|
| Seed | Reproducible random seed |
| Resolution | Canvas size in pixels |
| Line Weight | Thickness of grid lines |
| Min Cell Size | Smallest allowed rectangle |
| Split Chance | Probability of continuing subdivision |
| Color Probability | Chance a cell gets a primary color |
| Colors | Customizable palette |
| Use Gray | Include gray as a fill color |

## License

MIT
```

---

## Task 4: Add .gitignore

**File:** Create `~/mondrian-generator/.gitignore`

```
.DS_Store
Thumbs.db
*.png
*.jpg
*.jpeg
node_modules/
```

---

## Task 5: Commit Everything

**Commands:**
```bash
cd ~/mondrian-generator
git add .
git commit -m "feat: mondrian generative art generator with interactive controls"
```

---

## Task 6: Create GitHub Repo and Push

**Objective:** Create a public repo on GitHub and push.

**Commands:**
```bash
cd ~/mondrian-generator
gh repo create mondrian-generator --public --source=. --push --description "Generative art compositions in the style of Piet Mondrian"
```

**Expected output:** URL of the created repo, e.g. `https://github.com/USERNAME/mondrian-generator`

---

## Task 7: Verify GitHub Pages (Optional but Recommended)

**Objective:** Enable GitHub Pages so the app is live.

**Commands:**
```bash
cd ~/mondrian-generator
gh repo edit --homepage "https://USERNAME.github.io/mondrian-generator"
gh api repos/USERNAME/mondrian-generator/pages --method POST -f source='{"branch":"main","path":"/"}'
```

Replace `USERNAME` with the actual GitHub username. If Pages can't be enabled via API, note it and tell the user to enable manually in Settings > Pages.

---

## Design Notes for Implementer

1. **Color pickers:** Use `<input type="color">`. The value is hex like `#E60012`.
2. **Canvas sizing:** The canvas should be square. The `canvasSize` parameter controls both width and height.
3. **Responsive:** The canvas scales down to fit the container but the internal resolution stays at `canvasSize`.
4. **Line drawing:** p5's `rect(x, y, w, h)` with `noFill()` and `stroke()` draws the border. The stroke is centered on the edge, so colored rects need inset by `lineWeight/2` to avoid bleeding.
5. **Mondrian authenticity:** The recursive split with "thirds" bias creates the characteristic unequal proportions. No diagonals — only horizontal and vertical splits.
6. **Performance:** This is static art (`noLoop()`), so performance is trivial. No need for `p5.disableFriendlyErrors` but add it anyway before the p5 script tag for good practice.

## Verification Checklist

- [ ] Open `index.html` in browser, see a composition
- [ ] Click "Next" seed, composition changes
- [ ] Adjust line weight slider, lines get thicker/thinner
- [ ] Change a color picker, that color updates on regenerate
- [ ] Click "Download PNG", file saves correctly
- [ ] `git log` shows one commit
- [ ] GitHub repo exists and contains `index.html`

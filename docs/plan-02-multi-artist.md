# Multi-Artist Geometric Generator — Implementation Plan

> **For Hermes:** Use subagent-driven-development with GLM-5.2 model (provider: opencode-go) for each style implementation.

**Goal:** Expand the Mondrian generator to support 8 artist styles, with a style selector in the UI, artist tooltips, and the REFERENCES.md viewer. Fix empty/solid seed bug. Deploy to GitHub Pages.

**Architecture:** Single `index.html` with p5.js. A `style` parameter selects the generation algorithm. Artist data is embedded in JS for tooltips. REFERENCES.md is loaded/rendered in a modal panel.

**Tech Stack:** p5.js 1.11.3 (CDN), vanilla HTML/CSS/JS, GitHub CLI.

---

## Task 0: Bug Fix — Ensure Content in Every Seed (ALREADY DONE)

Added `ensureMinimumColor()` and `pickColorForced()` functions. The generator now forces at least 3 colored cells (or 12% of total cells, whichever is larger) and ensures at least 2 different colors exist when possible. This guarantees no empty or single-color compositions regardless of seed or parameter values.

---

## Task 1: UI — Add Style Selector, Artist Tooltips, and REFERENCES Modal

**File:** Modify `~/mondrian-generator/index.html`

### Style Selector Dropdown

Add a `<select>` in the sidebar, above the parameters section:

```html
<div class="control-group">
  <h2>Artist Style</h2>
  <select id="artistStyle" onchange="updateParam('style', this.value); regenerate()">
    <option value="mondrian">Piet Mondrian (De Stijl)</option>
    <option value="vandoesburg">Theo van Doesburg (Elementarism)</option>
    <option value="vanderleck">Bart van der Leck (De Stijl)</option>
    <option value="malevich">Kasimir Malevich (Suprematism)</option>
    <option value="lissitzky">El Lissitzky (Constructivism)</option>
    <option value="albers">Josef Albers (Homage to the Square)</option>
    <option value="kelly">Ellsworth Kelly (Hard-edge)</option>
    <option value="lewitt">Sol LeWitt (Wall Drawings)</option>
  </select>
</div>
```

### Artist Info Button + Tooltip/Modal

Add a small info button next to the style selector:

```html
<div class="control-row">
  <button onclick="showArtistInfo()" title="About this artist">&#9432; Info</button>
</div>
```

When clicked, show a modal/popup with:
- Artist name and movement
- 2-3 sentence description of their style
- Link to REFERENCES.md (or inline rendering)

Store artist data in a JS object:

```javascript
const ARTIST_DATA = {
  mondrian: {
    name: "Piet Mondrian",
    years: "1872–1944",
    movement: "Neoplasticism (De Stijl)",
    description: "Black orthogonal grids dividing the canvas into rectangles of unequal proportion. Strict primaries (red, blue, yellow) plus non-colors (white, gray, black). No diagonals, no curves, no depth.",
    keyWorks: ["Composition with Red, Blue, and Yellow (1930)", "Broadway Boogie Woogie (1943)"]
  },
  // ... etc for all 8 artists
};
```

### REFERENCES.md Viewer

Add a "View References" button in the sidebar actions area. When clicked, open a modal that fetches and renders `REFERENCES.md` from the repo (or embed it directly if CORS is an issue). Simpler approach: embed the markdown content as a hidden `<pre>` or render it with a simple markdown parser.

For simplicity, embed the REFERENCES.md content in a `<script type="text/plain">` tag and render it in a modal with basic formatting (convert `##` to `<h2>`, `---` to `<hr>`, etc.).

### CSS for Modal

```css
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7); z-index: 1000;
  display: none; align-items: center; justify-content: center;
}
.modal-overlay.active { display: flex; }
.modal-content {
  background: #12121a; border: 1px solid #333;
  border-radius: 8px; max-width: 800px; max-height: 80vh;
  overflow-y: auto; padding: 24px; color: #e0e0e0;
}
.modal-content h2 { color: #fff; margin-top: 0; }
.modal-content hr { border: none; border-top: 1px solid #333; margin: 16px 0; }
.modal-close {
  float: right; background: none; border: none; color: #888;
  font-size: 20px; cursor: pointer;
}
```

---

## Task 2: Refactor generateMondrian() into Style Router

Modify the generation logic:

```javascript
function generate() {
  cells = [];
  switch (PARAMS.style) {
    case 'mondrian': generateMondrian(); break;
    case 'vandoesburg': generateVanDoesburg(); break;
    case 'vanderleck': generateVanDerLeck(); break;
    case 'malevich': generateMalevich(); break;
    case 'lissitzky': generateLissitzky(); break;
    case 'albers': generateAlbers(); break;
    case 'kelly': generateKelly(); break;
    case 'lewitt': generateLeWitt(); break;
    default: generateMondrian();
  }
}
```

Each `generateX()` function is responsible for clearing the canvas, drawing its composition, and calling `ensureMinimumColor()` or equivalent if needed.

---

## Task 3: Implement Artist Styles

### Style 1: Piet Mondrian (ALREADY IMPLEMENTED)

Already working. The base `generateMondrian()` with recursive subdivision, thirds bias, primary colors, and black orthogonal lines.

---

### Style 2: Theo van Doesburg — Elementarism / Diagonal Mondrian

**Visual signature:** Mondrian grid + diagonals. The diagonal is the heresy that broke De Stijl.

**Algorithm:**

```javascript
function generateVanDoesburg() {
  // Step 1: Generate a base Mondrian grid
  cells = [];
  subdivide(0, 0, PARAMS.canvasSize, PARAMS.canvasSize);
  ensureMinimumColor();

  background(PARAMS.bgColor);

  // Step 2: Draw colored cells with slight diagonal rotation on some
  for (let c of cells) {
    if (c.color) {
      fill(c.color);
      noStroke();
      let inset = PARAMS.lineWeight / 2;
      // 30% chance to rotate this cell's fill by 15-45 degrees
      if (random() < 0.3) {
        push();
        translate(c.x + c.w/2, c.y + c.h/2);
        rotate(radians(random(15, 45) * (random() > 0.5 ? 1 : -1)));
        rectMode(CENTER);
        rect(0, 0, c.w - inset*2, c.h - inset*2);
        pop();
      } else {
        rect(c.x + inset, c.y + inset, c.w - inset*2, c.h - inset*2);
      }
    }
  }

  // Step 3: Draw orthogonal grid lines
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight);
  for (let c of cells) {
    noFill();
    rect(c.x, c.y, c.w, c.h);
  }

  // Step 4: Add 1-3 diagonal lines that slice through the composition
  let numDiagonals = floor(random(1, 4));
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight * 1.2);
  for (let i = 0; i < numDiagonals; i++) {
    let x1 = random() > 0.5 ? 0 : PARAMS.canvasSize;
    let y1 = random(PARAMS.canvasSize);
    let x2 = x1 === 0 ? PARAMS.canvasSize : 0;
    let y2 = random(PARAMS.canvasSize);
    line(x1, y1, x2, y2);
  }
}
```

**Key differences from Mondrian:**
- Some cells are drawn rotated
- 1-3 diagonal lines slice across the entire canvas
- More dynamic, less stable feeling

---

### Style 3: Bart van der Leck — Isolated Forms with Thick Outlines

**Visual signature:** Fewer lines, larger color blocks. Shapes float with thick black outlines like stained glass.

**Algorithm:**

```javascript
function generateVanDerLeck() {
  cells = [];
  // Use much lower split chance for larger blocks
  let oldSplitChance = PARAMS.splitChance;
  PARAMS.splitChance = 0.35;
  subdivide(0, 0, PARAMS.canvasSize, PARAMS.canvasSize);
  PARAMS.splitChance = oldSplitChance;
  ensureMinimumColor();

  background(PARAMS.bgColor);

  // Draw colored cells FIRST with thick outlines
  for (let c of cells) {
    if (c.color) {
      fill(c.color);
      stroke(PARAMS.lineColor);
      strokeWeight(PARAMS.lineWeight * 1.5);
      let inset = PARAMS.lineWeight;
      rect(c.x + inset, c.y + inset, c.w - inset*2, c.h - inset*2);
    }
  }

  // Only draw outlines for colored cells; leave white cells as background
  // No grid lines connecting cells
}
```

**Key differences:**
- Much lower split chance = fewer, larger cells
- Thick outlines around every colored form
- No connecting grid; shapes float independently
- White space is dominant

---

### Style 4: Kasimir Malevich — Suprematist Floating Forms

**Visual signature:** No grid. 3-8 geometric forms floating in white void. Black dominant, sparse primaries.

**Algorithm:**

```javascript
function generateMalevich() {
  background(PARAMS.bgColor);

  let numForms = floor(random(3, 9));
  let shapes = [];

  for (let i = 0; i < numForms; i++) {
    let type = random(['square', 'circle', 'rectangle', 'cross']);
    let size = random(PARAMS.canvasSize * 0.08, PARAMS.canvasSize * 0.35);
    let x = random(PARAMS.canvasSize * 0.1, PARAMS.canvasSize * 0.9 - size);
    let y = random(PARAMS.canvasSize * 0.1, PARAMS.canvasSize * 0.9 - size);

    // Pick color: 70% black, 30% primary
    let col;
    if (random() < 0.7) col = '#111111';
    else col = random([PARAMS.red, PARAMS.blue, PARAMS.yellow]);

    shapes.push({ type, x, y, w: size, h: size * random(0.6, 1.4), color: col });
  }

  // Draw from largest to smallest (painter's algorithm for overlap)
  shapes.sort((a, b) => b.w * b.h - a.w * a.h);

  noStroke();
  for (let s of shapes) {
    fill(s.color);
    if (s.type === 'square' || s.type === 'rectangle') {
      rect(s.x, s.y, s.w, s.h);
    } else if (s.type === 'circle') {
      ellipse(s.x + s.w/2, s.y + s.w/2, s.w);
    } else if (s.type === 'cross') {
      let t = s.w * 0.3;
      rect(s.x + s.w*0.35, s.y, t, s.h);
      rect(s.x, s.y + s.h*0.35, s.w, t);
    }
  }

  // Add thin "trail" lines from some shapes
  stroke(PARAMS.lineColor);
  strokeWeight(1);
  for (let s of shapes) {
    if (random() < 0.4) {
      let len = random(20, 100);
      let angle = random(TWO_PI);
      line(s.x + s.w/2, s.y + s.h/2,
           s.x + s.w/2 + cos(angle)*len, s.y + s.h/2 + sin(angle)*len);
    }
  }
}
```

**Key differences:**
- No grid, no lines connecting forms
- Forms float in white space
- Black is dominant; color is rare
- Include circles, crosses, not just rectangles
- Optional thin lines suggesting motion

---

### Style 5: El Lissitzky — Constructivist Axonometric Overlap

**Visual signature:** Overlapping rectangles with thin construction lines, suggesting architectural plans. Shallow depth through overlap.

**Algorithm:**

```javascript
function generateLissitzky() {
  background(PARAMS.bgColor);

  let numPlanes = floor(random(5, 12));
  let planes = [];

  for (let i = 0; i < numPlanes; i++) {
    let w = random(PARAMS.canvasSize * 0.15, PARAMS.canvasSize * 0.5);
    let h = random(PARAMS.canvasSize * 0.1, PARAMS.canvasSize * 0.4);
    let x = random(PARAMS.canvasSize * 0.05, PARAMS.canvasSize * 0.7);
    let y = random(PARAMS.canvasSize * 0.05, PARAMS.canvasSize * 0.7);

    let palette = [PARAMS.red, '#111111', PARAMS.grayColor, PARAMS.bgColor];
    let col = random(palette);

    planes.push({ x, y, w, h, color: col });
  }

  // Draw planes with slight shear to suggest axonometric projection
  for (let p of planes) {
    fill(p.color);
    noStroke();
    // Draw as parallelogram (sheared rectangle)
    let shear = random(-0.15, 0.15);
    beginShape();
    vertex(p.x, p.y);
    vertex(p.x + p.w, p.y);
    vertex(p.x + p.w + p.h * shear, p.y + p.h);
    vertex(p.x + p.h * shear, p.y + p.h);
    endShape(CLOSE);
  }

  // Draw thin "construction" lines
  stroke(PARAMS.lineColor);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    let x = random(PARAMS.canvasSize);
    line(x, 0, x + random(-50, 50), PARAMS.canvasSize);
  }

  // Add 1-2 circles breaking the rectilinear rhythm
  noStroke();
  fill(random([PARAMS.red, PARAMS.blue, PARAMS.yellow]));
  let cx = random(PARAMS.canvasSize * 0.2, PARAMS.canvasSize * 0.8);
  let cy = random(PARAMS.canvasSize * 0.2, PARAMS.canvasSize * 0.8);
  let r = random(20, 80);
  ellipse(cx, cy, r * 2);
}
```

**Key differences:**
- Overlapping sheared rectangles (parallelograms)
- Thin construction lines
- Circles breaking rectilinear rhythm
- Gray and black used structurally

---

### Style 6: Josef Albers — Homage to the Square

**Visual signature:** 3-4 concentric squares with systematic color variation. No lines, no grid.

**Algorithm:**

```javascript
function generateAlbers() {
  background(PARAMS.bgColor);

  let margin = PARAMS.canvasSize * 0.08;
  let available = PARAMS.canvasSize - margin * 2;

  // Generate 3-4 concentric squares
  let numSquares = floor(random(3, 5));
  let sizes = [];
  for (let i = 0; i < numSquares; i++) {
    sizes.push(available * pow(0.72, i));
  }

  // Generate colors from the palette with systematic variation
  let colors = [];
  let baseHue = random([PARAMS.red, PARAMS.blue, PARAMS.yellow, PARAMS.grayColor]);
  colors.push(baseHue);
  for (let i = 1; i < numSquares; i++) {
    colors.push(random([PARAMS.red, PARAMS.blue, PARAMS.yellow, PARAMS.grayColor, PARAMS.bgColor]));
  }

  // Draw from largest (outermost) to smallest
  for (let i = 0; i < numSquares; i++) {
    let s = sizes[i];
    let x = PARAMS.canvasSize/2 - s/2;
    let y = PARAMS.canvasSize/2 - s/2;
    fill(colors[i]);
    noStroke();
    rect(x, y, s, s);
  }
}
```

**Key differences:**
- No black lines at all
- Perfectly concentric squares
- Color is the entire subject
- Background is the outermost field

---

### Style 7: Ellsworth Kelly — Single Dominant Shape

**Visual signature:** One large shape on a contrasting background. Radical reduction.

**Algorithm:**

```javascript
function generateKelly() {
  background(PARAMS.bgColor);

  let mode = random(['single', 'grid']);

  if (mode === 'single') {
    // One dominant shape
    let type = random(['rect', 'circle', 'irregular']);
    let w = random(PARAMS.canvasSize * 0.3, PARAMS.canvasSize * 0.7);
    let h = random(PARAMS.canvasSize * 0.3, PARAMS.canvasSize * 0.7);
    let x = random(PARAMS.canvasSize * 0.1, PARAMS.canvasSize * 0.9 - w);
    let y = random(PARAMS.canvasSize * 0.1, PARAMS.canvasSize * 0.9 - h);

    fill(random([PARAMS.red, PARAMS.blue, PARAMS.yellow, PARAMS.grayColor]));
    noStroke();

    if (type === 'rect') {
      rect(x, y, w, h);
    } else if (type === 'circle') {
      ellipse(x + w/2, y + h/2, min(w, h));
    } else {
      // Irregular polygon
      beginShape();
      vertex(x, y);
      vertex(x + w, y + random(-20, 20));
      vertex(x + w + random(-20, 20), y + h);
      vertex(x + random(-20, 20), y + h);
      endShape(CLOSE);
    }
  } else {
    // Grid of monochromatic panels (like Colors for a Large Wall)
    let cols = floor(random(3, 6));
    let rows = floor(random(3, 6));
    let cellW = PARAMS.canvasSize / cols;
    let cellH = PARAMS.canvasSize / rows;
    let palette = [PARAMS.red, PARAMS.blue, PARAMS.yellow, PARAMS.grayColor, PARAMS.bgColor, PARAMS.lineColor];

    noStroke();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        fill(random(palette));
        rect(i * cellW, j * cellH, cellW, cellH);
      }
    }
  }
}
```

**Key differences:**
- Either one dominant shape or a grid of panels
- No lines separating forms (in grid mode, color boundaries act as edges)
- Shape occupies 30-70% of canvas
- Bold, flat color

---

### Style 8: Sol LeWitt — Rule-Based Combinatorial Lines

**Visual signature:** Grids with multiple line directions superimposed. Logical, systematic.

**Algorithm:**

```javascript
function generateLeWitt() {
  background(PARAMS.bgColor);

  let gridCols = floor(random(4, 8));
  let gridRows = floor(random(4, 8));
  let cellW = PARAMS.canvasSize / gridCols;
  let cellH = PARAMS.canvasSize / gridRows;

  let lineTypes = ['vertical', 'horizontal', 'diagLeft', 'diagRight'];
  let numTypes = floor(random(2, 5)); // 2 to 4 types used

  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight * 0.6);

  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      let x = i * cellW;
      let y = j * cellH;
      let usedTypes = [];
      for (let t = 0; t < numTypes; t++) {
        usedTypes.push(random(lineTypes));
      }

      for (let type of usedTypes) {
        if (type === 'vertical') {
          let num = floor(random(2, 5));
          for (let k = 1; k < num; k++) {
            let lx = x + cellW * k / num;
            line(lx, y, lx, y + cellH);
          }
        } else if (type === 'horizontal') {
          let num = floor(random(2, 5));
          for (let k = 1; k < num; k++) {
            let ly = y + cellH * k / num;
            line(x, ly, x + cellW, ly);
          }
        } else if (type === 'diagLeft') {
          line(x, y + cellH, x + cellW, y);
        } else if (type === 'diagRight') {
          line(x, y, x + cellW, y + cellH);
        }
      }
    }
  }

  // Add color bands to some cells
  noStroke();
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      if (random() < 0.25) {
        let x = i * cellW;
        let y = j * cellH;
        fill(random([PARAMS.red, PARAMS.blue, PARAMS.yellow, PARAMS.grayColor]));
        rect(x + 2, y + 2, cellW - 4, cellH - 4);
      }
    }
  }
}
```

**Key differences:**
- Grid is fixed and regular
- Each cell contains multiple superimposed line types
- Lines are thin and systematic
- Occasional color fills in cells

---

## Task 4: Update Parameter Handling for Multi-Style

When switching styles, some parameters may need resetting. For example:
- Albers and Kelly don't use `lineWeight`
- Malevich ignores `minCellSize`
- LeWitt uses a fixed grid

For simplicity, keep all parameters visible but note in the artist info which ones are most relevant. The algorithm for each style can choose to ignore irrelevant params.

---

## Task 5: GitHub Push & Pages Verification

**Commands:**
```bash
cd ~/mondrian-generator
git add index.html
git commit -m "feat: add 8 artist styles, artist info tooltips, REFERENCES viewer, and seed content fix"
git push origin main
```

**Verify Pages:** Wait 1-2 minutes, then `curl -s -o /dev/null -w "%{http_code}" https://alpairo.github.io/mondrian-generator/`

Expected: `200`

---

## Subagent Execution Plan

### Subagent A: Implement Styles (GLM-5.2 via opencode-go)

**Context:**
- Read the current `index.html` from `~/mondrian-generator/index.html`
- Read this plan from `~/.hermes/plans/2026-06-26_mondrian-multi-artist.md`
- Implement all 8 artist generation functions + the style router + artist data object + UI updates (style selector, info modal, REFERENCES viewer)
- Use the GLM-5.2 model. Provider is opencode-go.
- The Mondrian style is already implemented as `generateMondrian()`. Implement the other 7.
- The bug fix for empty seeds is already in place (`ensureMinimumColor()`).

**Deliverable:** Updated `index.html` with all styles working.

### Subagent B: Code Review & QA (GLM-5.2 via opencode-go)

**Context:**
- Read the updated `index.html`
- Open it in a browser or review the code
- Check:
  1. All 8 styles generate visually distinct output
  2. The style selector works and updates the composition
  3. Artist info modal shows correct data
  4. REFERENCES viewer renders the markdown
  5. No seed produces an empty or solid-color canvas
  6. Download PNG works for all styles
  7. The code is clean and follows the existing patterns

**Deliverable:** Approval or list of issues to fix.

### Subagent C: Fix Empty Seeds (ALREADY DONE)

The `ensureMinimumColor()` function has been added to the base Mondrian generator. This subagent's work is complete.

---

## Verification Checklist

- [ ] Style dropdown switches between all 8 artists
- [ ] Each style produces visually distinct output
- [ ] Artist info button shows tooltip/modal with correct description
- [ ] REFERENCES.md viewer opens and displays content
- [ ] No seed produces empty or single-color composition
- [ ] Download PNG works
- [ ] GitHub Pages serves updated content (HTTP 200)

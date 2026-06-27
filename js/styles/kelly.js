// === KELLY ===
// Radical simplification: either one massive dominant shape,
// or a grid of interchangeable monochromatic panels.
// Bold, flat, unmodulated color. The shape IS the composition.

function generateKelly() {
  let s = PARAMS.canvasSize;
  let mode = random() > 0.45 ? 'single' : 'panels';
  let palette = getPalette();

  background(PARAMS.bgColor);

  if (mode === 'single') {
    // ONE dominant shape occupying 35-70% of canvas
    let type = random(['rect', 'circle', 'horizontal_bar', 'vertical_bar']);
    let w, h, x, y;

    if (type === 'rect') {
      w = random(s * 0.35, s * 0.7);
      h = random(s * 0.35, s * 0.7);
      x = random(s * 0.05, s * 0.95 - w);
      y = random(s * 0.05, s * 0.95 - h);
    } else if (type === 'circle') {
      let r = random(s * 0.2, s * 0.38);
      w = r * 2;
      h = r * 2;
      x = random(s * 0.1, s * 0.9 - w);
      y = random(s * 0.1, s * 0.9 - h);
    } else if (type === 'horizontal_bar') {
      w = random(s * 0.5, s * 0.92);
      h = random(s * 0.12, s * 0.3);
      x = (s - w) / 2 + random(-30, 30);
      y = random(s * 0.15, s * 0.85 - h);
    } else {
      w = random(s * 0.12, s * 0.3);
      h = random(s * 0.5, s * 0.92);
      x = random(s * 0.15, s * 0.85 - w);
      y = (s - h) / 2 + random(-30, 30);
    }

    let col = random(palette);
    fill(col);
    noStroke();

    if (type === 'circle') {
      ellipse(x + w/2, y + h/2, w);
    } else {
      rect(x, y, w, h);
    }

    // Occasionally add a smaller accent shape
    if (random() < 0.4) {
      let aw = random(s * 0.06, s * 0.18);
      let ah = random(s * 0.06, s * 0.18);
      let ax = random(s * 0.05, s * 0.95 - aw);
      let ay = random(s * 0.05, s * 0.95 - ah);
      let acol = random(palette.filter(c => c !== col));
      if (acol) {
        fill(acol);
        rect(ax, ay, aw, ah);
      }
    }

  } else {
    // Grid of colored panels (like "Colors for a Large Wall")
    let cols = floor(random(3, 7));
    let rows = floor(random(3, 7));
    let gap = PARAMS.lineWeight;
    let cellW = (s - gap * (cols + 1)) / cols;
    let cellH = (s - gap * (rows + 1)) / rows;
    let allColors = [...palette, PARAMS.bgColor, PARAMS.lineColor];

    noStroke();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let x = gap + c * (cellW + gap);
        let y = gap + r * (cellH + gap);
        let col = random(allColors);
        fill(col);
        rect(x, y, cellW, cellH);
      }
    }
  }
}

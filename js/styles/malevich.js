// === MALEVICH ===
// Suprematism: 3-8 geometric forms floating in infinite white void.
// No grid, no connecting lines. Black dominant, sparse primaries.

function generateMalevich() {
  let s = PARAMS.canvasSize;
  background(PARAMS.bgColor);

  let numForms = floor(random(4, 10));
  let forms = [];
  let palette = getPalette();

  for (let i = 0; i < numForms; i++) {
    let type = random(['square', 'rectangle', 'circle', 'thin_rect', 'cross']);
    let size = random(s * 0.06, s * 0.32);
    let w = size;
    let h = size;

    if (type === 'rectangle') h = size * random(0.4, 0.8);
    if (type === 'thin_rect') { w = size * random(0.15, 0.35); h = size * random(1.2, 2.5); }
    if (type === 'cross') { w = size; h = size; }

    let margin = s * 0.08;
    let x = random(margin, s - w - margin);
    let y = random(margin, s - h - margin);

    // 65% black, 35% primary
    let col;
    if (random() < 0.65) col = PARAMS.lineColor;
    else col = random(palette);

    forms.push({ type, x, y, w, h, color: col });
  }

  // Ensure at least 2 colored forms (not black)
  let colored = forms.filter(f => f.color !== PARAMS.lineColor);
  if (colored.length < 2) {
    let blackForms = forms.filter(f => f.color === PARAMS.lineColor);
    let needed = 2 - colored.length;
    for (let i = 0; i < Math.min(needed, blackForms.length); i++) {
      blackForms[i].color = random(palette);
    }
  }

  // Sort by size: draw larger ones first (painter's algorithm)
  forms.sort((a, b) => (b.w * b.h) - (a.w * a.h));

  noStroke();
  for (let f of forms) {
    fill(f.color);

    if (f.type === 'square' || f.type === 'rectangle' || f.type === 'thin_rect') {
      rect(f.x, f.y, f.w, f.h);
    } else if (f.type === 'circle') {
      ellipse(f.x + f.w/2, f.y + f.w/2, f.w);
    } else if (f.type === 'cross') {
      let t = f.w * 0.25;
      rect(f.x + f.w*0.375, f.y, t, f.h);
      rect(f.x, f.y + f.h*0.375, f.w, t);
    }
  }

  // Optional thin trail lines suggesting motion
  stroke(PARAMS.lineColor);
  strokeWeight(1.5);
  for (let f of forms) {
    if (random() < 0.35) {
      let len = random(30, 120);
      let angle = random(TWO_PI);
      let cx = f.x + f.w/2;
      let cy = f.y + f.h/2;
      line(cx, cy, cx + cos(angle)*len, cy + sin(angle)*len);
    }
  }
}

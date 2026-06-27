// === VAN DER LECK ===
// Isolated colored forms with thick black outlines, floating on white.
// NO grid. Each shape is independently placed like stained glass.

function generateVanDerLeck() {
  let s = PARAMS.canvasSize;
  background(PARAMS.bgColor);

  let margin = s * 0.06;
  let numShapes = floor(random(4, 9));
  let shapes = [];
  let palette = getPalette();

  // Always include the background color as a "negative space" option
  let allPalette = [...palette, PARAMS.bgColor];

  for (let i = 0; i < numShapes; i++) {
    let w = random(s * 0.12, s * 0.45);
    let h = random(s * 0.12, s * 0.45);
    let x = random(margin, s - w - margin);
    let y = random(margin, s - h - margin);

    let col = random(allPalette);
    // Bias toward primaries for colored shapes
    if (random() < 0.7) col = random(palette);

    // Try to avoid too much overlap by checking against existing shapes
    let attempts = 0;
    let tooMuchOverlap = false;
    for (let existing of shapes) {
      let dx = Math.abs((x + w/2) - (existing.x + existing.w/2));
      let dy = Math.abs((y + h/2) - (existing.y + existing.h/2));
      if (dx < (w + existing.w) * 0.45 && dy < (h + existing.h) * 0.45) {
        tooMuchOverlap = true;
        break;
      }
    }

    if (!tooMuchOverlap || attempts > 20) {
      shapes.push({ x, y, w, h, color: col });
    }
  }

  // Ensure at least 3 colored shapes (not background color)
  let coloredShapes = shapes.filter(sh => sh.color !== PARAMS.bgColor);
  if (coloredShapes.length < 3) {
    let bgShapes = shapes.filter(sh => sh.color === PARAMS.bgColor);
    let needed = 3 - coloredShapes.length;
    for (let i = 0; i < Math.min(needed, bgShapes.length); i++) {
      bgShapes[i].color = random(palette);
    }
  }

  // Draw shapes from back to front (painter's algorithm)
  // Sort by size: larger ones first (appear behind)
  shapes.sort((a, b) => (b.w * b.h) - (a.w * a.h));

  for (let sh of shapes) {
    if (sh.color === PARAMS.bgColor) {
      // This is a "negative" shape: draw outline only
      noFill();
      stroke(PARAMS.lineColor);
      strokeWeight(PARAMS.lineWeight * 1.8);
      rect(sh.x, sh.y, sh.w, sh.h);
    } else {
      // Colored shape with thick outline
      fill(sh.color);
      stroke(PARAMS.lineColor);
      strokeWeight(PARAMS.lineWeight * 1.8);
      rect(sh.x, sh.y, sh.w, sh.h);
    }
  }

  // Add some thin connecting lines occasionally (van der Leck's early work)
  if (random() < 0.4) {
    stroke(PARAMS.lineColor);
    strokeWeight(PARAMS.lineWeight * 0.6);
    let numLines = floor(random(1, 4));
    for (let i = 0; i < numLines; i++) {
      let sh1 = random(shapes);
      let sh2 = random(shapes);
      if (sh1 !== sh2) {
        line(sh1.x + sh1.w/2, sh1.y + sh1.h/2, sh2.x + sh2.w/2, sh2.y + sh2.h/2);
      }
    }
  }
}

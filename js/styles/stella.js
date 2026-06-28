// === STELLA ===
// Minimalism: parallel stripes following an irregular contour,
// OR concentric irregular bands. Systematic, rule-driven.

function generateStella() {
  let s = PARAMS.canvasSize;
  beginBrushStyle(s);

  let mode = random() > 0.5 ? 'stripes' : 'concentric';
  let palette = getPalette();

  bBackground(PARAMS.bgColor);

  if (mode === 'stripes') {
    // Irregular polygon with parallel interior stripes
    let margin = s * 0.08;
    let w = s - margin * 2;
    let h = s * random(0.45, 0.8);
    let x = margin;
    let y = (s - h) / 2;

    // Create slightly irregular quadrilateral vertices
    let jitter = s * 0.015;
    let v = [
      { x: x + random(-jitter, jitter), y: y + random(-jitter, jitter) },
      { x: x + w + random(-jitter, jitter), y: y + random(-jitter, jitter) },
      { x: x + w + random(-jitter, jitter), y: y + h + random(-jitter, jitter) },
      { x: x + random(-jitter, jitter), y: y + h + random(-jitter, jitter) }
    ];

    let numStripes = floor(random(6, 14));
    let stripeColors = [PARAMS.lineColor, PARAMS.bgColor];
    // Add 1-3 primaries
    if (random() < 0.7) stripeColors.push(PARAMS.red);
    if (random() < 0.7) stripeColors.push(PARAMS.blue);
    if (random() < 0.5) stripeColors.push(PARAMS.yellow);

    for (let i = 0; i < numStripes; i++) {
      let t1 = i / numStripes;
      let t2 = (i + 1) / numStripes;
      let verts = [
        [lerp(v[0].x, v[3].x, t1), lerp(v[0].y, v[3].y, t1)],
        [lerp(v[0].x, v[3].x, t2), lerp(v[0].y, v[3].y, t2)],
        [lerp(v[1].x, v[2].x, t2), lerp(v[1].y, v[2].y, t2)],
        [lerp(v[1].x, v[2].x, t1), lerp(v[1].y, v[2].y, t1)]
      ];
      bPolygon(verts, stripeColors[i % stripeColors.length], null, 0);
    }

    // Outer contour
    let contour = [[v[0].x, v[0].y], [v[1].x, v[1].y], [v[2].x, v[2].y], [v[3].x, v[3].y]];
    bPolygon(contour, null, PARAMS.lineColor, PARAMS.lineWeight);

  } else {
    // Concentric irregular bands
    let numBands = floor(random(5, 10));
    let margin = s * 0.04;
    let allColors = [...palette, PARAMS.lineColor, PARAMS.grayColor, PARAMS.bgColor];

    for (let i = 0; i < numBands; i++) {
      let ratio = 1 - (i / numBands) * 0.88;
      let bw = (s - margin * 2) * ratio;
      let bh = bw * random(0.75, 1.0);
      let bx = (s - bw) / 2 + random(-s*0.02, s*0.02);
      let by = (s - bh) / 2 + random(-s*0.02, s*0.02);

      let jt = s * 0.012;
      let verts = [
        [bx + random(-jt, jt), by + random(-jt, jt)],
        [bx + bw + random(-jt, jt), by + random(-jt, jt)],
        [bx + bw + random(-jt, jt), by + bh + random(-jt, jt)],
        [bx + random(-jt, jt), by + bh + random(-jt, jt)]
      ];
      bPolygon(verts, allColors[i % allColors.length], null, 0);
    }
  }

  endBrushStyle();
}

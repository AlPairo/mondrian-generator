// === LISSITZKY ===
// Constructivism: overlapping sheared rectangles suggesting axonometric projection.
// Thin construction lines, circles breaking rectilinear rhythm.

function generateLissitzky() {
  let s = PARAMS.canvasSize;
  background(PARAMS.bgColor);

  let numPlanes = floor(random(6, 14));
  let planes = [];
  let palette = [PARAMS.red, PARAMS.blue, PARAMS.yellow, PARAMS.lineColor, PARAMS.grayColor, PARAMS.bgColor];

  for (let i = 0; i < numPlanes; i++) {
    let w = random(s * 0.12, s * 0.45);
    let h = random(s * 0.08, s * 0.35);
    let x = random(s * 0.02, s * 0.75);
    let y = random(s * 0.02, s * 0.75);
    let col = random(palette);
    let shear = random(-0.12, 0.12);

    planes.push({ x, y, w, h, color: col, shear });
  }

  // Ensure red and black are present
  let hasRed = planes.some(p => p.color === PARAMS.red);
  let hasBlack = planes.some(p => p.color === PARAMS.lineColor);
  if (!hasRed && planes.length > 0) planes[0].color = PARAMS.red;
  if (!hasBlack && planes.length > 1) planes[1].color = PARAMS.lineColor;

  // Draw from back to front
  for (let p of planes) {
    fill(p.color);
    noStroke();
    beginShape();
    vertex(p.x, p.y);
    vertex(p.x + p.w, p.y);
    vertex(p.x + p.w + p.h * p.shear, p.y + p.h);
    vertex(p.x + p.h * p.shear, p.y + p.h);
    endShape(CLOSE);
  }

  // Thin construction lines
  stroke(PARAMS.lineColor);
  strokeWeight(1);
  for (let i = 0; i < 6; i++) {
    let x = random(s);
    line(x, 0, x + random(-60, 60), s);
  }
  for (let i = 0; i < 4; i++) {
    let y = random(s);
    line(0, y, s, y + random(-60, 60));
  }

  // 1-2 circles breaking the rectilinear rhythm
  noStroke();
  let numCircles = floor(random(1, 3));
  for (let i = 0; i < numCircles; i++) {
    fill(random([PARAMS.red, PARAMS.blue, PARAMS.yellow]));
    let cx = random(s * 0.15, s * 0.85);
    let cy = random(s * 0.15, s * 0.85);
    let r = random(s * 0.03, s * 0.1);
    ellipse(cx, cy, r * 2);
  }
}

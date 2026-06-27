// === VAN DOESBURG ===
// Elementarism: Mondrian grid + diagonal slices + rotated cells

function generateVanDoesburg() {
  let s = PARAMS.canvasSize;
  let cells = [];

  subdivideRect(0, 0, s, s, cells, PARAMS.minCellSize, PARAMS.splitChance);
  ensureMinimumColor(cells);

  background(PARAMS.bgColor);

  // Draw colored cells (some rotated)
  for (let c of cells) {
    if (c.color) {
      fill(c.color);
      noStroke();
      let inset = PARAMS.lineWeight / 2;

      if (random() < 0.25 && c.w > 60 && c.h > 60) {
        // Rotate this cell's fill slightly
        push();
        translate(c.x + c.w / 2, c.y + c.h / 2);
        rotate(radians(random(12, 35) * (random() > 0.5 ? 1 : -1)));
        rectMode(CENTER);
        rect(0, 0, c.w - inset * 2, c.h - inset * 2);
        pop();
      } else {
        rect(c.x + inset, c.y + inset, c.w - inset * 2, c.h - inset * 2);
      }
    }
  }

  // Draw orthogonal grid lines
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight);
  for (let c of cells) {
    noFill();
    rect(c.x, c.y, c.w, c.h);
  }

  // Add diagonal slices that cut through the entire composition
  let numDiagonals = floor(random(1, 4));
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight * 1.3);

  for (let i = 0; i < numDiagonals; i++) {
    let startSide = floor(random(4)); // 0=top, 1=right, 2=bottom, 3=left
    let endSide = floor(random(4));
    while (endSide === startSide) endSide = floor(random(4));

    let x1, y1, x2, y2;
    if (startSide === 0) { x1 = random(s); y1 = 0; }
    else if (startSide === 1) { x1 = s; y1 = random(s); }
    else if (startSide === 2) { x1 = random(s); y1 = s; }
    else { x1 = 0; y1 = random(s); }

    if (endSide === 0) { x2 = random(s); y2 = 0; }
    else if (endSide === 1) { x2 = s; y2 = random(s); }
    else if (endSide === 2) { x2 = random(s); y2 = s; }
    else { x2 = 0; y2 = random(s); }

    line(x1, y1, x2, y2);
  }
}

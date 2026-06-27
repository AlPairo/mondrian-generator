// === MONDRIAN ===
// Neoplasticism: black orthogonal grid, primary colors, asymmetric balance

function generateMondrian() {
  let s = PARAMS.canvasSize;
  let cells = [];

  subdivideRect(0, 0, s, s, cells, PARAMS.minCellSize, PARAMS.splitChance);
  ensureMinimumColor(cells);

  background(PARAMS.bgColor);

  // Draw colored cells first
  for (let c of cells) {
    if (c.color) {
      fill(c.color);
      noStroke();
      let inset = PARAMS.lineWeight / 2;
      rect(c.x + inset, c.y + inset, c.w - inset * 2, c.h - inset * 2);
    }
  }

  // Draw grid lines on top
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight);
  for (let c of cells) {
    noFill();
    rect(c.x, c.y, c.w, c.h);
  }
}

// === MONDRIAN ===
// Neoplasticism: black orthogonal grid, primary colors, asymmetric balance

function generateMondrian() {
  let s = PARAMS.canvasSize;
  beginBrushStyle(s);

  let cells = [];

  subdivideRect(0, 0, s, s, cells, PARAMS.minCellSize, PARAMS.splitChance);
  ensureMinimumColor(cells);

  bBackground(PARAMS.bgColor);

  // Draw colored cells first
  for (let c of cells) {
    if (c.color) {
      let inset = PARAMS.lineWeight / 2;
      bRect(c.x + inset, c.y + inset, c.w - inset * 2, c.h - inset * 2, c.color, null, 0);
    }
  }

  // Draw grid lines on top
  for (let c of cells) {
    bRect(c.x, c.y, c.w, c.h, null, PARAMS.lineColor, PARAMS.lineWeight);
  }

  endBrushStyle();
}

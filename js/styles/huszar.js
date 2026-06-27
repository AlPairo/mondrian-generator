// === HUSZAR ===
// Calmer Mondrian: fewer cells, one dominant block, balanced proportions.
// Gray is a natural part of the palette.

function generateHuszar() {
  let s = PARAMS.canvasSize;
  let cells = [];

  // Lower split chance = calmer, fewer cells
  let effectiveSplit = PARAMS.splitChance * 0.6;
  subdivideRect(0, 0, s, s, cells, PARAMS.minCellSize * 1.3, effectiveSplit);

  // Force gray into palette for this style
  let oldUseGray = PARAMS.useGray;
  PARAMS.useGray = true;
  ensureMinimumColor(cells, Math.max(3, Math.floor(cells.length * 0.2)), 2);
  PARAMS.useGray = oldUseGray;

  // Sort by area: largest first
  cells.sort((a, b) => (b.w * b.h) - (a.w * a.h));

  // Ensure the largest cell has color (signature dominant block)
  if (cells.length > 0 && !cells[0].color) {
    cells[0].color = pickColorForced();
  }

  // Ensure we have at least one gray cell
  let hasGray = cells.some(c => c.color === PARAMS.grayColor);
  if (!hasGray) {
    let empty = cells.find(c => !c.color);
    if (empty) empty.color = PARAMS.grayColor;
    else if (cells.length > 2) cells[2].color = PARAMS.grayColor;
  }

  background(PARAMS.bgColor);

  // Draw colored cells
  for (let c of cells) {
    if (c.color) {
      fill(c.color);
      noStroke();
      let inset = PARAMS.lineWeight / 2;
      rect(c.x + inset, c.y + inset, c.w - inset * 2, c.h - inset * 2);
    }
  }

  // Draw grid lines
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight);
  for (let c of cells) {
    noFill();
    rect(c.x, c.y, c.w, c.h);
  }
}

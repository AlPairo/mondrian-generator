// === LEWITT ===
// Rule-based grid: each cell contains multiple superimposed line types.
// Logical, combinatorial, systematic. Thin lines, occasional color fills.

function generateLeWitt() {
  let s = PARAMS.canvasSize;
  beginBrushStyle(s);

  let cols = floor(random(4, 8));
  let rows = floor(random(4, 8));
  let gap = PARAMS.lineWeight;
  let cellW = (s - gap * (cols + 1)) / cols;
  let cellH = (s - gap * (rows + 1)) / rows;
  let lineTypes = ['vertical', 'horizontal', 'diag1', 'diag2', 'cross', 'grid'];

  // First pass: decide colored cells
  let coloredCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (random() < PARAMS.colorProbability * 0.5) {
        coloredCells.push({ r, c });
      }
    }
  }
  // Ensure at least some color
  if (coloredCells.length < 2) {
    coloredCells.push({ r: floor(random(rows)), c: floor(random(cols)) });
    coloredCells.push({ r: floor(random(rows)), c: floor(random(cols)) });
  }

  bBackground(PARAMS.bgColor);

  // Draw colored cells
  for (let cc of coloredCells) {
    let x = gap + cc.c * (cellW + gap);
    let y = gap + cc.r * (cellH + gap);
    bRect(x, y, cellW, cellH, pickColorForced(), null, 0);
  }

  // Draw line patterns in each cell
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = gap + c * (cellW + gap);
      let y = gap + r * (cellH + gap);

      // Each cell gets 1-3 line types
      let numTypes = floor(random(1, 4));
      let usedTypes = [];
      for (let t = 0; t < numTypes; t++) {
        usedTypes.push(random(lineTypes));
      }

      let lw = max(1, PARAMS.lineWeight * 0.35);

      for (let type of usedTypes) {
        if (type === 'vertical') {
          let n = floor(random(2, 6));
          for (let i = 1; i < n; i++) {
            let lx = x + (cellW / n) * i;
            bLine(lx, y, lx, y + cellH, PARAMS.lineColor, lw);
          }
        } else if (type === 'horizontal') {
          let n = floor(random(2, 6));
          for (let i = 1; i < n; i++) {
            let ly = y + (cellH / n) * i;
            bLine(x, ly, x + cellW, ly, PARAMS.lineColor, lw);
          }
        } else if (type === 'diag1') {
          bLine(x, y, x + cellW, y + cellH, PARAMS.lineColor, lw);
        } else if (type === 'diag2') {
          bLine(x + cellW, y, x, y + cellH, PARAMS.lineColor, lw);
        } else if (type === 'cross') {
          bLine(x, y, x + cellW, y + cellH, PARAMS.lineColor, lw);
          bLine(x + cellW, y, x, y + cellH, PARAMS.lineColor, lw);
        } else if (type === 'grid') {
          let n = floor(random(2, 4));
          for (let i = 1; i < n; i++) {
            let lx = x + (cellW / n) * i;
            bLine(lx, y, lx, y + cellH, PARAMS.lineColor, lw);
            let ly = y + (cellH / n) * i;
            bLine(x, ly, x + cellW, ly, PARAMS.lineColor, lw);
          }
        }
      }
    }
  }

  // Outer grid lines
  for (let c = 0; c <= cols; c++) {
    let x = c * (cellW + gap) + gap / 2;
    bLine(x, 0, x, s, PARAMS.lineColor, PARAMS.lineWeight);
  }
  for (let r = 0; r <= rows; r++) {
    let y = r * (cellH + gap) + gap / 2;
    bLine(0, y, s, y, PARAMS.lineColor, PARAMS.lineWeight);
  }

  endBrushStyle();
}

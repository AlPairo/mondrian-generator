// === LEWITT ===
// Rule-based grid: each cell contains multiple superimposed line types.
// Logical, combinatorial, systematic. Thin lines, occasional color fills.

function generateLeWitt() {
  let s = PARAMS.canvasSize;
  background(PARAMS.bgColor);

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

  // Draw colored cells
  noStroke();
  for (let cc of coloredCells) {
    let x = gap + cc.c * (cellW + gap);
    let y = gap + cc.r * (cellH + gap);
    fill(pickColorForced());
    rect(x, y, cellW, cellH);
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

      stroke(PARAMS.lineColor);
      strokeWeight(max(1, PARAMS.lineWeight * 0.35));

      for (let type of usedTypes) {
        if (type === 'vertical') {
          let n = floor(random(2, 6));
          for (let i = 1; i < n; i++) {
            let lx = x + (cellW / n) * i;
            line(lx, y, lx, y + cellH);
          }
        } else if (type === 'horizontal') {
          let n = floor(random(2, 6));
          for (let i = 1; i < n; i++) {
            let ly = y + (cellH / n) * i;
            line(x, ly, x + cellW, ly);
          }
        } else if (type === 'diag1') {
          line(x, y, x + cellW, y + cellH);
        } else if (type === 'diag2') {
          line(x + cellW, y, x, y + cellH);
        } else if (type === 'cross') {
          line(x, y, x + cellW, y + cellH);
          line(x + cellW, y, x, y + cellH);
        } else if (type === 'grid') {
          let n = floor(random(2, 4));
          for (let i = 1; i < n; i++) {
            let lx = x + (cellW / n) * i;
            line(lx, y, lx, y + cellH);
            let ly = y + (cellH / n) * i;
            line(x, ly, x + cellW, ly);
          }
        }
      }
    }
  }

  // Outer grid lines
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight);
  for (let c = 0; c <= cols; c++) {
    let x = c * (cellW + gap) + gap / 2;
    line(x, 0, x, s);
  }
  for (let r = 0; r <= rows; r++) {
    let y = r * (cellH + gap) + gap / 2;
    line(0, y, s, y);
  }
}

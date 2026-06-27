// === VAN DOESBURG ===
// Elementarism: the diagonal as primary compositional axis.
// A sheared grid creates parallelograms and diamonds.
// One bold diagonal organizes the entire composition.
// This is NOT "Mondrian + diagonals on top" — the diagonal IS the structure.

function generateVanDoesburg() {
  let s = PARAMS.canvasSize;
  let palette = getPalette();

  background(PARAMS.bgColor);

  // === CONFIGURATION ===
  // Shear amount controls how "diagonal" the grid feels
  // Positive = leans right, negative = leans left
  let shearAmount = random(0.18, 0.42) * (random() > 0.5 ? 1 : -1);

  // Grid dimensions
  let numCols = floor(random(3, 7));
  let numRows = floor(random(3, 7));
  let cellW = s / numCols;
  let cellH = s / numRows;

  // === BUILD CELLS ===
  let cells = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      let baseX = c * cellW;
      let baseY = r * cellH;

      // Apply vertical shear: x shifts based on y position
      let shearOffset = baseY * shearAmount;

      cells.push({
        c: c,
        r: r,
        baseX: baseX,
        baseY: baseY,
        shearOffset: shearOffset,
        w: cellW,
        h: cellH,
        color: random() < 0.38 ? random(palette) : null
      });
    }
  }

  // Ensure content
  ensureMinimumColor(cells, Math.max(3, Math.floor(cells.length * 0.15)), 2);

  // === PHASE 1: DRAW COLORED CELLS ===
  // These are parallelograms, not rectangles
  noStroke();
  for (let cell of cells) {
    if (cell.color) {
      fill(cell.color);
      drawShearedCell(cell.baseX, cell.baseY, cell.w, cell.h, shearAmount);
    }
  }

  // === PHASE 2: DRAW PRIMARY DIAGONAL AXIS ===
  // One dominant diagonal line that organizes the composition
  // This is the "counter-compositional" element
  let diagAngle = atan(shearAmount) * 2; // Derived from shear for harmony
  let diagCX = s * random(0.35, 0.65);
  let diagCY = s * random(0.35, 0.65);
  let diagLen = s * 1.6;

  // Draw the diagonal slightly behind the grid lines but visible
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight * 2.2);
  drawingContext.setLineDash([]);
  line(
    diagCX - cos(diagAngle) * diagLen,
    diagCY - sin(diagAngle) * diagLen,
    diagCX + cos(diagAngle) * diagLen,
    diagCY + sin(diagAngle) * diagLen
  );

  // === PHASE 3: DRAW SHEARED GRID LINES ===
  // Vertical lines become diagonal (due to shear)
  stroke(PARAMS.lineColor);
  strokeWeight(PARAMS.lineWeight);

  for (let c = 0; c <= numCols; c++) {
    let x = c * cellW;
    // A vertical line in sheared space goes from (x, 0) to (x + s*shear, s)
    line(x, 0, x + s * shearAmount, s);
  }

  // Horizontal lines stay horizontal
  for (let r = 0; r <= numRows; r++) {
    let y = r * cellH;
    line(0, y, s, y);
  }

  // === PHASE 4: DIAGONAL ACCENT BANDS ===
  // Add 1-2 colored bands that follow the diagonal axis
  // These are parallelogram strips crossing the composition
  if (random() < 0.7) {
    let bandWidth = random(s * 0.06, s * 0.15);
    let bandColor = random(palette);

    // Draw diagonal band by creating a polygon
    fill(bandColor);
    noStroke();

    let bx1 = diagCX - cos(diagAngle) * diagLen;
    let by1 = diagCY - sin(diagAngle) * diagLen;
    let bx2 = diagCX + cos(diagAngle) * diagLen;
    let by2 = diagCY + sin(diagAngle) * diagLen;

    // Perpendicular offset for band width
    let perpX = -sin(diagAngle) * bandWidth * 0.5;
    let perpY = cos(diagAngle) * bandWidth * 0.5;

    beginShape();
    vertex(bx1 + perpX, by1 + perpY);
    vertex(bx2 + perpX, by2 + perpY);
    vertex(bx2 - perpX, by2 - perpY);
    vertex(bx1 - perpX, by1 - perpY);
    endShape(CLOSE);

    // Redraw diagonal line on top of band (so it stays visible)
    stroke(PARAMS.lineColor);
    strokeWeight(PARAMS.lineWeight * 1.5);
    line(bx1, by1, bx2, by2);
  }

  // === PHASE 5: CORNER TRIANGLES ===
  // Van Doesburg often placed small triangles in corners
  // These are created by the diagonal axis meeting canvas edges
  let cornerTriangles = floor(random(1, 4));
  for (let i = 0; i < cornerTriangles; i++) {
    let corner = floor(random(4)); // 0=TL, 1=TR, 2=BR, 3=BL
    let triSize = random(s * 0.08, s * 0.2);
    fill(random(palette));
    noStroke();

    beginShape();
    if (corner === 0) {
      // Top-left
      vertex(0, 0);
      vertex(triSize, 0);
      vertex(0, triSize);
    } else if (corner === 1) {
      // Top-right
      vertex(s, 0);
      vertex(s - triSize, 0);
      vertex(s, triSize);
    } else if (corner === 2) {
      // Bottom-right
      vertex(s, s);
      vertex(s - triSize, s);
      vertex(s, s - triSize);
    } else {
      // Bottom-left
      vertex(0, s);
      vertex(triSize, s);
      vertex(0, s - triSize);
    }
    endShape(CLOSE);
  }

  // === PHASE 6: DOTTED ACCENT (optional, rare) ===
  // Some van Doesburg works include small squares as accents
  if (random() < 0.3) {
    let numDots = floor(random(2, 5));
    for (let i = 0; i < numDots; i++) {
      let ds = random(s * 0.02, s * 0.05);
      let dx = random(s * 0.1, s * 0.9);
      let dy = random(s * 0.1, s * 0.9);
      fill(random(palette));
      noStroke();
      rect(dx - ds/2, dy - ds/2, ds, ds);
    }
  }
}

// Draw a parallelogram cell using vertical shear
// The top edge is shifted by (y * shear), bottom edge by ((y+h) * shear)
function drawShearedCell(x, y, w, h, shear) {
  let shiftTop = y * shear;
  let shiftBottom = (y + h) * shear;

  beginShape();
  vertex(x + shiftTop, y);
  vertex(x + w + shiftTop, y);
  vertex(x + w + shiftBottom, y + h);
  vertex(x + shiftBottom, y + h);
  endShape(CLOSE);
}

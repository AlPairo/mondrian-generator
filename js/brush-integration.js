// === BRUSH INTEGRATION ===
// Wraps p5.brush for use across all geometric abstraction styles.
// Falls back to standard p5 primitives if p5.brush is not available.

function hasBrush() {
  return typeof brush !== 'undefined';
}

function initBrush() {
  if (hasBrush()) {
    // p5.brush auto-initializes on createCanvas(WEBGL).
    // brush.load() is only needed for offscreen buffers.
    brush.noStroke();
    brush.noFill();
  }
}

// Call at the start of each style generator to set WEBGL coordinates to top-left
function beginBrushStyle(s) {
  if (!hasBrush()) return;
  push();
  translate(-s / 2, -s / 2);
  brush.noStroke();
  brush.noFill();
}

// Call at the end of each style generator
function endBrushStyle() {
  if (!hasBrush()) return;
  pop();
}

// Background
function bBackground(col) {
  background(col);
}

// Line
function bLine(x1, y1, x2, y2, col, w) {
  if (!hasBrush()) {
    stroke(col);
    strokeWeight(w);
    line(x1, y1, x2, y2);
    return;
  }
  brush.noFill();
  brush.set('marker', col);
  brush.strokeWeight(max(0.3, w / 6));
  brush.line(x1, y1, x2, y2);
}

// Rectangle with optional fill and/or stroke
function bRect(x, y, w, h, fillCol, strokeCol, strokeW) {
  if (!hasBrush()) {
    if (fillCol) {
      fill(fillCol);
      noStroke();
      rect(x, y, w, h);
    }
    if (strokeCol) {
      noFill();
      stroke(strokeCol);
      strokeWeight(strokeW);
      rect(x, y, w, h);
    }
    return;
  }

  if (fillCol) {
    brush.noStroke();
    brush.fill(fillCol, 235);
    brush.fillBleed(0.05, 'out');
    brush.fillTexture(0.2, 0.3, true);
    brush.polygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]).fill();
  }

  if (strokeCol) {
    brush.noFill();
    brush.set('marker', strokeCol);
    brush.strokeWeight(max(0.3, strokeW / 6));
    brush.rect(x, y, w, h);
  }
}

// Ellipse with optional fill and/or stroke
function bEllipse(cx, cy, w, h, fillCol, strokeCol, strokeW) {
  if (!hasBrush()) {
    if (fillCol) {
      fill(fillCol);
      noStroke();
      ellipse(cx, cy, w, h);
    }
    if (strokeCol) {
      noFill();
      stroke(strokeCol);
      strokeWeight(strokeW);
      ellipse(cx, cy, w, h);
    }
    return;
  }

  let rx = w / 2;
  let ry = h / 2;
  let steps = max(16, floor(TWO_PI * max(rx, ry) / 30));

  if (fillCol) {
    brush.noStroke();
    brush.fill(fillCol, 235);
    brush.fillBleed(0.05, 'out');
    brush.fillTexture(0.2, 0.3, true);
    let verts = [];
    for (let i = 0; i < steps; i++) {
      let a = TWO_PI * i / steps;
      verts.push([cx + cos(a) * rx, cy + sin(a) * ry]);
    }
    brush.polygon(verts).fill();
  }

  if (strokeCol) {
    brush.noFill();
    brush.set('marker', strokeCol);
    brush.strokeWeight(max(0.3, strokeW / 6));
    brush.circle(cx, cy, max(rx, ry));
  }
}

// Polygon with optional fill and/or stroke
// verts = array of [x, y] arrays
function bPolygon(verts, fillCol, strokeCol, strokeW) {
  if (!hasBrush()) {
    if (fillCol) {
      fill(fillCol);
      noStroke();
      beginShape();
      for (let v of verts) vertex(v[0], v[1]);
      endShape(CLOSE);
    }
    if (strokeCol) {
      noFill();
      stroke(strokeCol);
      strokeWeight(strokeW);
      beginShape();
      for (let v of verts) vertex(v[0], v[1]);
      endShape(CLOSE);
    }
    return;
  }

  if (fillCol) {
    brush.noStroke();
    brush.fill(fillCol, 235);
    brush.fillBleed(0.05, 'out');
    brush.fillTexture(0.2, 0.3, true);
    brush.polygon(verts).fill();
  }

  if (strokeCol) {
    brush.noFill();
    brush.set('marker', strokeCol);
    brush.strokeWeight(max(0.3, strokeW / 6));
    for (let i = 0; i < verts.length; i++) {
      let v1 = verts[i];
      let v2 = verts[(i + 1) % verts.length];
      brush.line(v1[0], v1[1], v2[0], v2[1]);
    }
  }
}

// Triangle shorthand
function bTriangle(x1, y1, x2, y2, x3, y3, fillCol, strokeCol, strokeW) {
  bPolygon([[x1, y1], [x2, y2], [x3, y3]], fillCol, strokeCol, strokeW);
}

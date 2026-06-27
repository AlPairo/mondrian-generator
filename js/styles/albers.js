// === ALBERS ===
// Homage to the Square: 3-4 concentric squares with systematic color variation.
// NO lines. Color interaction IS the subject.

function generateAlbers() {
  let s = PARAMS.canvasSize;
  background(PARAMS.bgColor);

  let margin = s * 0.06;
  let available = s - margin * 2;

  // 3-4 concentric squares
  let numSquares = floor(random(3, 5));
  let sizes = [];
  let ratio = random(0.68, 0.78);
  for (let i = 0; i < numSquares; i++) {
    sizes.push(available * pow(ratio, i));
  }

  // Build color progression
  let colors = [];
  let palette = getPalette();
  let allColors = [...palette, PARAMS.grayColor, PARAMS.bgColor];

  // Start with a random base
  let base = random(allColors);
  colors.push(base);

  // Each subsequent square shifts subtly or contrasts
  for (let i = 1; i < numSquares; i++) {
    // 50% chance to pick from palette, 50% to lerp toward another color
    if (random() < 0.5) {
      colors.push(random(allColors));
    } else {
      let target = random(allColors);
      colors.push(lerpColorHex(colors[i-1], target, random(0.3, 0.7)));
    }
  }

  noStroke();
  for (let i = 0; i < numSquares; i++) {
    let sz = sizes[i];
    let x = (s - sz) / 2;
    let y = (s - sz) / 2;
    fill(colors[i]);
    rect(x, y, sz, sz);
  }
}

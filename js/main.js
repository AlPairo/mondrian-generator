// === P5.JS MAIN ===
// Setup, draw loop, and style router

function generateStyle() {
  switch (PARAMS.style) {
    case 'mondrian': generateMondrian(); break;
    case 'vandoesburg': generateVanDoesburg(); break;
    case 'vanderleck': generateVanDerLeck(); break;
    case 'malevich': generateMalevich(); break;
    case 'lissitzky': generateLissitzky(); break;
    case 'albers': generateAlbers(); break;
    case 'kelly': generateKelly(); break;
    case 'lewitt': generateLeWitt(); break;
    case 'stella': generateStella(); break;
    case 'huszar': generateHuszar(); break;
    default: generateMondrian(); break;
  }
}

function setup() {
  PARAMS = getDefaultParams();
  let cnv = createCanvas(PARAMS.canvasSize, PARAMS.canvasSize);
  cnv.parent('canvas-container');
  pixelDensity(1);
  colorMode(RGB, 255, 255, 255, 255);

  randomSeed(PARAMS.seed);
  noiseSeed(PARAMS.seed);
  generateStyle();
  noLoop();

  setupModalClosing();
}

function draw() {
  // All drawing happens in generateStyle()
}

function windowResized() {
  // Canvas stays at PARAMS.canvasSize; CSS handles display scaling
}

function keyPressed() {
  if (key === 's' || key === 'S') downloadPNG();
  if (key === 'r' || key === 'R') { randomSeedValue(); }
}

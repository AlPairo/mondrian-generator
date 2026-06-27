// === SHARED UTILITIES ===
// Common functions used across all artist styles

const ARTIST_DATA = {
  mondrian: {
    name: 'Piet Mondrian',
    years: '1872\u20131944',
    movement: 'Neoplasticism (De Stijl)',
    description: 'Dutch painter who co-founded De Stijl in 1917. Black orthogonal lines forming irregular grids filled with red, blue, yellow, white, and gray. The quintessential geometric abstractionist.',
    keyWorks: ['Composition with Red, Blue, and Yellow (1930)', 'Broadway Boogie Woogie (1943)']
  },
  vandoesburg: {
    name: 'Theo van Doesburg',
    years: '1883\u20131931',
    movement: 'De Stijl, Elementarism',
    description: 'Founder of De Stijl magazine. In 1924 he introduced the diagonal into his compositions, breaking with Mondrian and founding Elementarism to embrace dynamic tension and movement.',
    keyWorks: ['Counter-Composition V (1924)', 'Simultaneous Counter-Composition (1929\u201330)']
  },
  vanderleck: {
    name: 'Bart van der Leck',
    years: '1876\u20131958',
    movement: 'De Stijl',
    description: 'The oldest De Stijl member and its precursor. Known for thick black outlines around isolated, simplified color forms that float on generous white grounds like stained glass windows.',
    keyWorks: ['The Tempest (1916)', 'Composition 1917 (1917)']
  },
  malevich: {
    name: 'Kasimir Malevich',
    years: '1878\u20131935',
    movement: 'Suprematism',
    description: 'Russian artist who founded Suprematism in 1915 with his iconic Black Square. Geometric forms float in infinite white voids, seeking "the supremacy of pure artistic feeling."',
    keyWorks: ['Black Square (1915)', 'Suprematist Composition: Airplane Flying (1915)']
  },
  lissitzky: {
    name: 'El Lissitzky',
    years: '1890\u20131941',
    movement: 'Suprematism, Constructivism',
    description: 'Russian painter and architect who extended Suprematism into 3D via his Proun series. Overlapping sheared planes, thin construction lines, and a structural approach to abstraction.',
    keyWorks: ['Proun 99 (1923\u201325)', 'Beat the Whites with the Red Wedge (1919)']
  },
  albers: {
    name: 'Josef Albers',
    years: '1888\u20131976',
    movement: 'Bauhaus, Hard-edge painting',
    description: 'German-American artist best known for Homage to the Square \u2014 over 1,000 nested-square paintings exploring color interaction. Color itself becomes the entire subject.',
    keyWorks: ['Homage to the Square: With Orchids (1962)', 'Homage to the Square: Apparition (1959)']
  },
  kelly: {
    name: 'Ellsworth Kelly',
    years: '1923\u20132015',
    movement: 'Hard-edge painting, Color Field',
    description: 'American master of radical simplification. A single shape on a canvas, or a grid of interchangeable monochromatic panels. Bridges European abstraction and American minimalism.',
    keyWorks: ['Colors for a Large Wall (1951)', 'Red Blue Green (1963)']
  },
  lewitt: {
    name: 'Sol LeWitt',
    years: '1928\u20132007',
    movement: 'Conceptual art, Minimalism',
    description: 'American artist whose Wall Drawings center on instructions rather than execution. Written rules are the artwork; draftsmen execute them. Logical, combinatorial, systematic.',
    keyWorks: ['Wall Drawing #11 (1969)', 'Wall Drawing #122 (1972)']
  },
  stella: {
    name: 'Frank Stella',
    years: '1936\u2013',
    movement: 'Minimalism, Post-painterly abstraction',
    description: 'American painter from the reductive Black Paintings to complex sculptural reliefs. Parallel stripes, concentric bands, and shaped canvases driven by systematic rules.',
    keyWorks: ['The Marriage of Reason and Squalor, II (1959)', 'Harran II (1967)']
  },
  huszar: {
    name: 'Vilmos Husz\u00e1r',
    years: '1884\u20131960',
    movement: 'De Stijl',
    description: 'Hungarian-Dutch founding artist of De Stijl. His work is visually close to Mondrian but tends toward calmer, more meditative balance with one dominant large block and smaller satellites.',
    keyWorks: ['Composition with Yellow, Blue and Red (1920)', 'Mechano-Dancer (1922)']
  }
};

// === GLOBAL PARAMS ===
let PARAMS = {};

function getDefaultParams() {
  return {
    seed: 42,
    style: 'mondrian',
    canvasSize: 800,
    lineWeight: 8,
    minCellSize: 80,
    splitChance: 0.65,
    colorProbability: 0.35,
    red: '#E60012',
    blue: '#0055BF',
    yellow: '#F6B800',
    lineColor: '#111111',
    bgColor: '#F4F4F4',
    grayColor: '#D0D0D0',
    useGray: false,
  };
}

// === PALETTE HELPERS ===
function getPalette() {
  const p = [PARAMS.red, PARAMS.blue, PARAMS.yellow];
  if (PARAMS.useGray) p.push(PARAMS.grayColor);
  return p;
}

function getAllColors() {
  return [PARAMS.red, PARAMS.blue, PARAMS.yellow, PARAMS.grayColor, PARAMS.lineColor, PARAMS.bgColor];
}

function pickColor() {
  if (random() > PARAMS.colorProbability) return null;
  return pickColorForced();
}

function pickColorForced() {
  const palette = getPalette();
  return random(palette);
}

function pickFromPalette(palette) {
  return random(palette);
}

// === ENSURE CONTENT ===
function ensureMinimumColor(cells, minCount, minColors) {
  minCount = minCount || Math.max(3, Math.floor(cells.length * 0.12));
  minColors = minColors || 2;

  let colored = cells.filter(c => c.color !== null);
  if (colored.length < minCount) {
    let empty = cells.filter(c => c.color === null);
    empty.sort(() => random() - 0.5);
    let needed = minCount - colored.length;
    for (let i = 0; i < Math.min(needed, empty.length); i++) {
      empty[i].color = pickColorForced();
    }
  }

  colored = cells.filter(c => c.color !== null);
  let uniqueColors = new Set(colored.map(c => c.color));
  if (uniqueColors.size < minColors && colored.length >= minColors) {
    let empty = cells.filter(c => c.color === null);
    if (empty.length > 0) {
      let palette = getPalette().filter(c => !uniqueColors.has(c));
      if (palette.length > 0) {
        empty[0].color = random(palette);
      }
    }
  }
}

// === GRID SUBDIVISION (Mondrian-style) ===
function subdivideRect(x, y, w, h, cells, minSize, splitChance) {
  if (w < minSize * 2 && h < minSize * 2) {
    cells.push({ x, y, w, h, color: pickColor() });
    return;
  }
  if (w < minSize || h < minSize || random() > splitChance) {
    cells.push({ x, y, w, h, color: pickColor() });
    return;
  }

  let ratio = w / h;
  let splitVert;
  if (ratio > 1.8) splitVert = true;
  else if (ratio < 0.55) splitVert = false;
  else splitVert = random() > 0.5;

  if (splitVert && w > minSize) {
    let splitAt = random(minSize, w - minSize);
    let thirds = [w * 0.33, w * 0.5, w * 0.67];
    let closest = thirds.reduce((a, b) => Math.abs(b - splitAt) < Math.abs(a - splitAt) ? b : a);
    if (abs(splitAt - closest) < w * 0.1) splitAt = closest;

    subdivideRect(x, y, splitAt, h, cells, minSize, splitChance);
    subdivideRect(x + splitAt, y, w - splitAt, h, cells, minSize, splitChance);
  } else if (!splitVert && h > minSize) {
    let splitAt = random(minSize, h - minSize);
    let thirds = [h * 0.33, h * 0.5, h * 0.67];
    let closest = thirds.reduce((a, b) => Math.abs(b - splitAt) < Math.abs(a - splitAt) ? b : a);
    if (abs(splitAt - closest) < h * 0.1) splitAt = closest;

    subdivideRect(x, y, w, splitAt, cells, minSize, splitChance);
    subdivideRect(x, y + splitAt, w, h - splitAt, cells, minSize, splitChance);
  } else {
    cells.push({ x, y, w, h, color: pickColor() });
  }
}

// === COLOR UTILITIES ===
function hexToRgb(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    let hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function lerpColorHex(c1, c2, amt) {
  let a = hexToRgb(c1);
  let b = hexToRgb(c2);
  return rgbToHex(
    lerp(a.r, b.r, amt),
    lerp(a.g, b.g, amt),
    lerp(a.b, b.b, amt)
  );
}

// === GEOMETRY UTILITIES ===
function randomPointInRect(margin, w, h) {
  return {
    x: random(margin, w - margin),
    y: random(margin, h - margin)
  };
}

function rectIntersects(r1, r2) {
  return !(r2.x > r1.x + r1.w ||
           r2.x + r2.w < r1.x ||
           r2.y > r1.y + r1.h ||
           r2.y + r2.h < r1.y);
}

function rectContains(outer, inner, padding) {
  padding = padding || 0;
  return inner.x >= outer.x + padding &&
         inner.y >= outer.y + padding &&
         inner.x + inner.w <= outer.x + outer.w - padding &&
         inner.y + inner.h <= outer.y + outer.h - padding;
}

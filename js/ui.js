// === UI HANDLERS ===

function updateParam(key, value) {
  PARAMS[key] = value;
}

function showVal(el, labelId) {
  let label = document.getElementById(labelId);
  if (label) label.textContent = el.value;
}

function changeSeed(delta) {
  PARAMS.seed += delta;
  document.getElementById('seedInput').value = PARAMS.seed;
  regenerate();
}

function randomSeedValue() {
  PARAMS.seed = Math.floor(Math.random() * 1000000);
  document.getElementById('seedInput').value = PARAMS.seed;
  regenerate();
}

function setSeed(val) {
  PARAMS.seed = val;
  document.getElementById('seedInput').value = val;
  regenerate();
}

function resizeAndRegenerate() {
  resizeCanvas(PARAMS.canvasSize, PARAMS.canvasSize);
  regenerate();
}

function regenerate() {
  randomSeed(PARAMS.seed);
  noiseSeed(PARAMS.seed);
  generateStyle();
  redraw();
}

function resetDefaults() {
  PARAMS = getDefaultParams();
  document.getElementById('styleSelect').value = PARAMS.style;
  document.getElementById('seedInput').value = PARAMS.seed;
  document.getElementById('canvasSize').value = PARAMS.canvasSize;
  document.getElementById('lineWeight').value = PARAMS.lineWeight;
  document.getElementById('lineWeightVal').textContent = PARAMS.lineWeight;
  document.getElementById('minCellSize').value = PARAMS.minCellSize;
  document.getElementById('minCellSizeVal').textContent = PARAMS.minCellSize;
  document.getElementById('splitChance').value = PARAMS.splitChance;
  document.getElementById('splitChanceVal').textContent = PARAMS.splitChance;
  document.getElementById('colorProbability').value = PARAMS.colorProbability;
  document.getElementById('colorProbabilityVal').textContent = PARAMS.colorProbability;
  document.getElementById('red').value = PARAMS.red;
  document.getElementById('blue').value = PARAMS.blue;
  document.getElementById('yellow').value = PARAMS.yellow;
  document.getElementById('lineColor').value = PARAMS.lineColor;
  document.getElementById('bgColor').value = PARAMS.bgColor;
  document.getElementById('grayColor').value = PARAMS.grayColor;
  document.getElementById('useGray').checked = PARAMS.useGray;
  resizeAndRegenerate();
}

function downloadPNG() {
  let styleName = PARAMS.style;
  saveCanvas(styleName + '-seed-' + PARAMS.seed, 'png');
}

// === MODALS ===

function showArtistInfo() {
  let data = ARTIST_DATA[PARAMS.style];
  if (!data) return;

  document.getElementById('artistModalTitle').textContent = data.name;
  let body = document.getElementById('artistModalBody');
  body.innerHTML = `
    <h4>Period</h4>
    <p>${data.years} \u2014 ${data.movement}</p>
    <h4>Style</h4>
    <p>${data.description}</p>
    <h4>Key Works</h4>
    <div class="artist-keyworks">
      ${data.keyWorks.map(w => `<span>${w}</span>`).join('')}
    </div>
  `;
  openModal('artistModal');
}

function showReferences() {
  let source = document.getElementById('references-source').textContent;
  let html = renderMarkdownBasic(source);
  document.getElementById('refsModalBody').innerHTML = html;
  openModal('refsModal');
}

function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// Close modal on overlay click
function setupModalClosing() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
}

// === MARKDOWN RENDERER ===

function renderMarkdownBasic(md) {
  return md
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h4>$1</h4>')
    .replace(/^# (.+)$/gm, '<h3 style="color:#fff;margin:0 0 8px;">$1</h3>')
    .replace(/^\*\*\*$/gm, '<hr>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.+<\/li>\n)+/g, '<ul>$&</ul>')
    .replace(/<\/ul>\n<ul>/g, '\n')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[34].*?<\/h[34]>)<\/p>/g, '$1')
    .replace(/<p>(<hr>)<\/p>/g, '$1')
    .replace(/<p>(<ul>.*?<\/ul>)<\/p>/gs, '$1');
}

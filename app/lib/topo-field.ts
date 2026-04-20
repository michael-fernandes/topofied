// Peak elevation per tag — a mountain's "height" is its semantic weight.
const PEAK_HEIGHTS: Record<string, number> = {
  SECTION: 100,
  H1: 100, H2: 68, H3: 46, H4: 34, H5: 28, H6: 25,
  BUTTON: 100,
  IMG: 72, VIDEO: 72,
  ARTICLE: 80, BLOCKQUOTE: 36, PRE: 36, FIGURE: 40, TABLE: 40,
  P: 24,
  INPUT: 30, TEXTAREA: 30, SELECT: 30,
  LABEL: 18, LI: 18,
  A: 14,
};

function elementPeak(el: Element): number {
  return PEAK_HEIGHTS[el.tagName] ?? 20;
}

function hash2(ix: number, iy: number, seed: number): number {
  let h = (ix | 0) * 374761393 + (iy | 0) * 668265263 + (seed | 0) * 1442695040;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix,     iy,     seed);
  const b = hash2(ix + 1, iy,     seed);
  const c = hash2(ix,     iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  const ab = a + (b - a) * sx;
  const cd = c + (d - c) * sx;
  return ab + (cd - ab) * sy;
}

export type FieldResult = {
  field: Float32Array;
  cols: number;
  rows: number;
  res: number;
  width: number;
  height: number;
};

export function buildElevationField(): FieldResult | null {
  const docWidth  = document.documentElement.scrollWidth;
  const docHeight = document.documentElement.scrollHeight;

  const RES  = 3;
  const cols = Math.ceil(docWidth  / RES) + 1;
  const rows = Math.ceil(docHeight / RES) + 1;
  const field = new Float32Array(cols * rows);

  // Seed noise from page text so each page has a stable terrain
  let seed = 2166136261;
  const seedText = (document.body.innerText || "").slice(0, 400);
  for (let i = 0; i < seedText.length; i++) {
    seed = Math.imul(seed ^ seedText.charCodeAt(i), 16777619);
  }

  // Select elements, containers absorb their children
  const selector =
    "section,h1,h2,h3,h4,h5,h6,p,button,a,img,video,input,textarea,select," +
    "article,blockquote,pre,figure,table,label,li";

  const candidates = document.querySelectorAll(selector);
  const claimed = new Set<Element>();
  const selected: { rect: DOMRect; peak: number; falloff: number; sharpness: number }[] = [];

  // Container elements form the base terrain but let children create peaks on top
  const CONTAINER_TAGS = new Set(["SECTION", "ARTICLE", "FIGURE"]);

  candidates.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return;

    let parent = el.parentElement;
    while (parent && parent !== document.body) {
      if (claimed.has(parent)) return;
      parent = parent.parentElement;
    }

    // Only non-container elements claim — so section/article children still get processed
    if (!CONTAINER_TAGS.has(el.tagName)) {
      claimed.add(el);
    }

    const peak = elementPeak(el);
    // Containers get a short falloff + high sharpness → steep "mesa" cliffs
    // that bunch contour lines at the element boundary (= visual container).
    // Regular elements get a gentler Gaussian-ish peak.
    const isContainer = CONTAINER_TAGS.has(el.tagName);
    const falloff   = isContainer ? 18 + peak * 0.4  : 40 + peak * 2.0;
    const sharpness = isContainer ? 3.0               : 1.6;
    selected.push({ rect, peak, falloff, sharpness });
  });

  // Noise amplitudes kept low so peak/mesa signals dominate.
  // Raise these to add more organic warping at the cost of containment clarity.
  const NS1 = 1 / 540, AMP1 = 14;
  const NS2 = 1 / 190, AMP2 = 6;
  const NS3 = 1 / 68,  AMP3 = 2;

  // First pass: fill with noise only (valleys)
  for (let gy = 0; gy < rows; gy++) {
    const wy = gy * RES;
    for (let gx = 0; gx < cols; gx++) {
      const wx = gx * RES;
      const n =
        (valueNoise(wx * NS1, wy * NS1, seed)     - 0.5) * 2 * AMP1 +
        (valueNoise(wx * NS2, wy * NS2, seed + 1) - 0.5) * 2 * AMP2 +
        (valueNoise(wx * NS3, wy * NS3, seed + 2) - 0.5) * 2 * AMP3;
      field[gy * cols + gx] = n;
    }
  }

  // Second pass: add peak contributions on top of the noise field
  for (const { rect, peak, falloff, sharpness } of selected) {
    const elLeft   = rect.left + window.scrollX;
    const elTop    = rect.top  + window.scrollY;
    const elRight  = elLeft + rect.width;
    const elBottom = elTop  + rect.height;

    const reach = falloff * 4.5;
    const gxMin = Math.max(0, Math.floor((elLeft   - reach) / RES));
    const gxMax = Math.min(cols - 1, Math.ceil((elRight  + reach) / RES));
    const gyMin = Math.max(0, Math.floor((elTop    - reach) / RES));
    const gyMax = Math.min(rows - 1, Math.ceil((elBottom + reach) / RES));

    const invFalloff = 1 / falloff;

    for (let gy = gyMin; gy <= gyMax; gy++) {
      const py = gy * RES;
      const sdY = Math.max(elTop - py, py - elBottom);

      for (let gx = gxMin; gx <= gxMax; gx++) {
        const px = gx * RES;
        const sdX = Math.max(elLeft - px, px - elRight);

        let dist: number;
        if (sdX <= 0 && sdY <= 0) {
          dist = 0;
        } else if (sdX > 0 && sdY > 0) {
          dist = Math.sqrt(sdX * sdX + sdY * sdY);
        } else {
          dist = Math.max(sdX, sdY);
        }

        const contribution = peak * Math.exp(-Math.pow(dist * invFalloff, sharpness));
        field[gy * cols + gx] += contribution;
      }
    }
  }

  // Normalize to 0..100
  let minVal = Infinity;
  let maxVal = -Infinity;
  for (let i = 0; i < field.length; i++) {
    const v = field[i];
    if (v < minVal) minVal = v;
    if (v > maxVal) maxVal = v;
  }
  const range = maxVal - minVal;
  if (range < 1) return null;
  const scale = 100 / range;
  for (let i = 0; i < field.length; i++) {
    field[i] = (field[i] - minVal) * scale;
  }

  return { field, cols, rows, res: RES, width: docWidth, height: docHeight };
}

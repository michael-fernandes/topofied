// Topo contour engine — pure TS, no deps, no DOM.
// Builds an elevation field from rectangular "peaks", then extracts isolines
// via marching squares. Consumers render the resulting path data into an SVG.

export type Peak = {
  id?: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Current visible height (may include hover boost). */
  height: number;
  /** Base height WITHOUT hover boost — used for stable normalization. */
  baseHeight?: number;
  falloff: number;
  sharpness: number;
};

export type FieldResult = {
  field: Float32Array;
  cols: number;
  rows: number;
  res: number;
  width: number;
  height: number;
};

export type LevelSpec = {
  d: string;
  stroke: string;
  strokeWidth: number;
  isIndex: boolean;
  level: number;
  t: number;
};

// ── Hash noise (stable per-seed) ─────────────────────────────
function hash2(ix: number, iy: number, seed: number): number {
  let h =
    (ix | 0) * 374761393 +
    (iy | 0) * 668265263 +
    (seed | 0) * 1442695040;
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
  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  const ab = a + (b - a) * sx;
  const cd = c + (d - c) * sx;
  return ab + (cd - ab) * sy;
}

export function hashSeed(str: string): number {
  let seed = 2166136261;
  for (let i = 0; i < str.length; i++) {
    seed = Math.imul(seed ^ str.charCodeAt(i), 16777619);
  }
  return seed >>> 0;
}

// ── Build elevation field ────────────────────────────────────
export function buildField(opts: {
  width: number;
  height: number;
  peaks: Peak[];
  seed?: number;
  res?: number;
  noiseAmp?: number;
}): FieldResult | null {
  const { width, height, peaks, seed = 42, res = 4, noiseAmp = 1 } = opts;
  const cols = Math.ceil(width / res) + 1;
  const rows = Math.ceil(height / res) + 1;
  const field = new Float32Array(cols * rows);

  const NS1 = 1 / 540,
    AMP1 = 16 * noiseAmp;
  const NS2 = 1 / 190,
    AMP2 = 4 * noiseAmp;
  const NS3 = 1 / 68,
    AMP3 = 0.6 * noiseAmp;

  // 1) noise base
  for (let gy = 0; gy < rows; gy++) {
    const wy = gy * res;
    for (let gx = 0; gx < cols; gx++) {
      const wx = gx * res;
      const n =
        (valueNoise(wx * NS1, wy * NS1, seed) - 0.5) * 2 * AMP1 +
        (valueNoise(wx * NS2, wy * NS2, seed + 1) - 0.5) * 2 * AMP2 +
        (valueNoise(wx * NS3, wy * NS3, seed + 2) - 0.5) * 2 * AMP3;
      field[gy * cols + gx] = n;
    }
  }

  // 2) domain-warp field — perturbs (x,y) before peak distance lookup so
  //    contour rings around peaks read as organic terrain (ridges, spurs,
  //    gullies, saddles) instead of clean concentric ovals. The same warp
  //    field is reused across all peaks so terrain stays globally coherent:
  //    adjacent peaks naturally form saddles where their warped shapes meet.
  //    Two octaves: a large-scale bend + a smaller-scale crinkle.
  const WARP_S1 = 1 / 280,
    WARP_A1 = 24 * noiseAmp;
  const WARP_S2 = 1 / 110,
    WARP_A2 = 8 * noiseAmp;
  const WARP_MAX = WARP_A1 + WARP_A2;

  const warpX = new Float32Array(cols * rows);
  const warpY = new Float32Array(cols * rows);
  for (let gy = 0; gy < rows; gy++) {
    const wy = gy * res;
    for (let gx = 0; gx < cols; gx++) {
      const wx = gx * res;
      warpX[gy * cols + gx] =
        (valueNoise(wx * WARP_S1, wy * WARP_S1, seed + 7) - 0.5) * 2 * WARP_A1 +
        (valueNoise(wx * WARP_S2, wy * WARP_S2, seed + 9) - 0.5) * 2 * WARP_A2;
      warpY[gy * cols + gx] =
        (valueNoise(wx * WARP_S1, wy * WARP_S1, seed + 8) - 0.5) * 2 * WARP_A1 +
        (valueNoise(wx * WARP_S2, wy * WARP_S2, seed + 11) - 0.5) * 2 * WARP_A2;
    }
  }

  // 3) peak contributions (using warped coordinates)
  for (const peak of peaks) {
    const { x, y, w, h, height: pk, falloff, sharpness } = peak;
    const left = x,
      top = y,
      right = x + w,
      bottom = y + h;

    // Expand bbox by max warp amplitude so warped lookups near the edge
    // still get the full peak contribution.
    const reach = falloff * 4.5 + WARP_MAX;
    const gxMin = Math.max(0, Math.floor((left - reach) / res));
    const gxMax = Math.min(cols - 1, Math.ceil((right + reach) / res));
    const gyMin = Math.max(0, Math.floor((top - reach) / res));
    const gyMax = Math.min(rows - 1, Math.ceil((bottom + reach) / res));
    const invFalloff = 1 / falloff;

    for (let gy = gyMin; gy <= gyMax; gy++) {
      const py = gy * res;
      for (let gx = gxMin; gx <= gxMax; gx++) {
        const px = gx * res;
        const idx = gy * cols + gx;
        const wpx = px + warpX[idx];
        const wpy = py + warpY[idx];
        const sdX = Math.max(left - wpx, wpx - right);
        const sdY = Math.max(top - wpy, wpy - bottom);
        let dist: number;
        if (sdX <= 0 && sdY <= 0) dist = 0;
        else if (sdX > 0 && sdY > 0) dist = Math.sqrt(sdX * sdX + sdY * sdY);
        else dist = Math.max(sdX, sdY);
        const contrib = pk * Math.exp(-Math.pow(dist * invFalloff, sharpness));
        field[idx] += contrib;
      }
    }
  }

  // 3) normalize to 0..100 using stable reference bounds so hover boosts
  //    don't shift the whole contour set.
  let minV = Infinity,
    maxV = -Infinity;
  for (let i = 0; i < field.length; i++) {
    const v = field[i];
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
  let stableMax = AMP1 + AMP2 + AMP3;
  for (const p of peaks) {
    stableMax = Math.max(
      stableMax,
      (p.baseHeight ?? p.height) + AMP1 + AMP2 + AMP3
    );
  }
  const refMax = Math.max(stableMax, maxV);
  const refMin = Math.min(-(AMP1 + AMP2 + AMP3), minV);
  const range = refMax - refMin;
  if (range < 1) return null;
  const scale = 100 / range;
  for (let i = 0; i < field.length; i++) {
    field[i] = (field[i] - refMin) * scale;
  }

  return { field, cols, rows, res, width, height };
}

// ── Marching squares ────────────────────────────────────────
function edgeLerp(a: number, b: number, va: number, vb: number, t: number) {
  const dv = vb - va;
  if (Math.abs(dv) < 1e-6) return (a + b) / 2;
  return a + (b - a) * ((t - va) / dv);
}

function contourPathData(fr: FieldResult, threshold: number): string {
  const { field, cols, rows, res } = fr;
  const parts: string[] = [];
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const tl = field[row * cols + col];
      const tr = field[row * cols + col + 1];
      const br = field[(row + 1) * cols + col + 1];
      const bl = field[(row + 1) * cols + col];
      const c =
        (tl >= threshold ? 8 : 0) |
        (tr >= threshold ? 4 : 0) |
        (br >= threshold ? 2 : 0) |
        (bl >= threshold ? 1 : 0);
      if (c === 0 || c === 15) continue;
      const x0 = col * res,
        y0 = row * res;
      const x1 = x0 + res,
        y1 = y0 + res;
      const topX = edgeLerp(x0, x1, tl, tr, threshold);
      const rightY = edgeLerp(y0, y1, tr, br, threshold);
      const bottomX = edgeLerp(x0, x1, bl, br, threshold);
      const leftY = edgeLerp(y0, y1, tl, bl, threshold);
      switch (c) {
        case 1:
          parts.push(`M${x0},${leftY}L${bottomX},${y1}`);
          break;
        case 2:
          parts.push(`M${bottomX},${y1}L${x1},${rightY}`);
          break;
        case 3:
          parts.push(`M${x0},${leftY}L${x1},${rightY}`);
          break;
        case 4:
          parts.push(`M${topX},${y0}L${x1},${rightY}`);
          break;
        case 5:
          parts.push(`M${topX},${y0}L${x1},${rightY}`);
          parts.push(`M${x0},${leftY}L${bottomX},${y1}`);
          break;
        case 6:
          parts.push(`M${topX},${y0}L${bottomX},${y1}`);
          break;
        case 7:
          parts.push(`M${topX},${y0}L${x0},${leftY}`);
          break;
        case 8:
          parts.push(`M${topX},${y0}L${x0},${leftY}`);
          break;
        case 9:
          parts.push(`M${topX},${y0}L${bottomX},${y1}`);
          break;
        case 10:
          parts.push(`M${topX},${y0}L${x0},${leftY}`);
          parts.push(`M${bottomX},${y1}L${x1},${rightY}`);
          break;
        case 11:
          parts.push(`M${topX},${y0}L${x1},${rightY}`);
          break;
        case 12:
          parts.push(`M${x0},${leftY}L${x1},${rightY}`);
          break;
        case 13:
          parts.push(`M${bottomX},${y1}L${x1},${rightY}`);
          break;
        case 14:
          parts.push(`M${x0},${leftY}L${bottomX},${y1}`);
          break;
      }
    }
  }
  return parts.join("");
}

// ── Level builder ───────────────────────────────────────────
export function buildLevels(
  fr: FieldResult,
  opts: {
    numLevels?: number;
    indexEvery?: number;
    baseHue?: number;
    accentHue?: number;
    accentSat?: number;
    minLevel?: number;
    maxLevel?: number;
    theme?: "dark" | "paper";
  } = {}
): LevelSpec[] {
  const {
    numLevels = 34,
    indexEvery = 4,
    baseHue = 0,
    accentHue = 200,
    accentSat = 55,
    minLevel = 0.02,
    maxLevel = 1.0,
    theme = "dark",
  } = opts;
  // ── Visual tuning ──────────────────────────────────────────
  // t = 0 (valley floor) → t = 1 (peak). Ranges are [low, high].
  // "index" lines are the bold accent lines every `indexEvery` levels.
  const DARK = {
    index:   { lit: 55,  alpha: 0.50, width: 1.2 },
    lineLit:   [44, 56]  as [number, number],  // lightness range low→high
    lineAlpha: [0.28, 0.39] as [number, number], // opacity range low→high
    lineWidth: [0.5, 0.7]   as [number, number],
  };
  const PAPER = {
    index:   { lit: 8,   alpha: 0.75, width: 1.2 },
    lineLit:   [40, 18]  as [number, number],  // inverted: valleys lighter on paper
    lineAlpha: [0.18, 0.63] as [number, number],
    lineWidth: [0.35, 0.80]  as [number, number],
  };
  // ───────────────────────────────────────────────────────────

  const levels: LevelSpec[] = [];
  for (let l = 1; l < numLevels; l++) {
    const t = l / numLevels;
    if (t < minLevel || t > maxLevel) continue;
    const isIndex = l % indexEvery === 0;

    let stroke: string;
    let sw: number;
    if (theme === "paper") {
      const C = PAPER;
      const lit   = isIndex ? C.index.lit   : C.lineLit[0]   + t * (C.lineLit[1]   - C.lineLit[0]);
      const alpha = isIndex ? C.index.alpha : C.lineAlpha[0] + t * (C.lineAlpha[1] - C.lineAlpha[0]);
      sw           = isIndex ? C.index.width : C.lineWidth[0] + t * (C.lineWidth[1] - C.lineWidth[0]);
      stroke = `hsla(${isIndex ? accentHue : baseHue},${isIndex ? accentSat : 6}%,${lit}%,${alpha})`;
    } else {
      const C = DARK;
      const lit   = isIndex ? C.index.lit   : C.lineLit[0]   + t * (C.lineLit[1]   - C.lineLit[0]);
      const alpha = isIndex ? C.index.alpha : C.lineAlpha[0] + t * (C.lineAlpha[1] - C.lineAlpha[0]);
      sw           = isIndex ? C.index.width : C.lineWidth[0] + t * (C.lineWidth[1] - C.lineWidth[0]);
      stroke = `hsla(${isIndex ? accentHue : baseHue},${isIndex ? accentSat : 0}%,${lit}%,${alpha})`;
    }

    // Curve threshold distribution toward valleys: exp > 1 packs more
    // contour lines into low-elevation areas, fewer around tall peaks.
    const threshold = Math.pow(t, 2.4) * 100;
    const d = contourPathData(fr, threshold);
    if (!d) continue;
    levels.push({ d, stroke, strokeWidth: sw, isIndex, level: l, t });
  }
  return levels;
}

// ── Pooled SVG renderer ─────────────────────────────────────
export function createRenderer(svg: SVGSVGElement) {
  const paths: SVGPathElement[] = [];
  return function render(levels: LevelSpec[]) {
    while (paths.length < levels.length) {
      const p = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      ) as SVGPathElement;
      p.setAttribute("fill", "none");
      svg.appendChild(p);
      paths.push(p);
    }
    for (let i = 0; i < levels.length; i++) {
      const lvl = levels[i];
      const p = paths[i];
      p.setAttribute("d", lvl.d);
      p.setAttribute("stroke", lvl.stroke);
      p.setAttribute("stroke-width", String(lvl.strokeWidth));
      p.style.display = "";
      if (lvl.isIndex) p.setAttribute("data-index", "true");
      else p.removeAttribute("data-index");
    }
    for (let i = levels.length; i < paths.length; i++) {
      paths[i].style.display = "none";
    }
  };
}

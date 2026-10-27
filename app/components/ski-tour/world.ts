// The three.js side of the ski tour: terrain, skier, summits, camera, loop.
// Knows nothing about React — the component hands it a container and an input
// object and gets a per-frame snapshot back. Physics lives in lib/ski-terrain.

import * as THREE from "three";
import {
  SUMMITS,
  WORLD_HALF,
  BASE_CAMP,
  heightAt,
  createSkier,
  step,
  summitAt,
  metres,
  type Input,
  type Mode,
} from "../../lib/ski-terrain";

export type Frame = {
  x: number;
  z: number;
  heading: number;
  elevation: number;
  speed: number;
  mode: Mode;
  tooSteep: boolean;
  summitId: string | undefined;
};

// Palette pulled from kit.tsx so the 3D range sits in the site's warm dusk.
const BG = new THREE.Color("#241d18");
const SKY_TOP = new THREE.Color("#120e0b");
const LOW = new THREE.Color("#3b3028");
const ROCK = new THREE.Color("#5a4b3f");
const SNOW = new THREE.Color("#e6dccd");
const LINE = new THREE.Color("hsl(26, 38%, 58%)");
const INDEX = new THREE.Color("hsl(26, 46%, 44%)");
const ACCENT = new THREE.Color("hsl(26, 46%, 72%)");
const JACKET = new THREE.Color("#d0743a");

const CONTOUR_INTERVAL = 4; // world units between contour lines
const TRAIL_MAX = 6000;

const terrainVert = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying float vDist;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 mv = viewMatrix * wp;
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

// Hillshade + snowline + contour lines, so the range reads like the site's
// topo map pulled up into 3D. fwidth keeps the lines one pixel-ish at any range.
const terrainFrag = /* glsl */ `
  uniform vec3 uLow, uRock, uSnow, uLine, uIndex, uFog, uSun;
  uniform float uInterval, uFogNear, uFogFar;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying float vDist;

  float contour(float v, float thickness) {
    float w = fwidth(v);
    float d = abs(fract(v - 0.5) - 0.5) / max(w, 1e-4);
    // Fade out where lines would crowd into a solid smear.
    return (1.0 - clamp(d - thickness, 0.0, 1.0)) * (1.0 - smoothstep(0.25, 0.6, w));
  }

  void main() {
    vec3 n = normalize(vNormal);
    float h = vPos.y;
    float steep = 1.0 - n.y;
    // Valleys are dusted, the range above treeline is fully white; rock shows
    // only where it's too steep to hold snow.
    float snow = mix(0.35, 1.0, smoothstep(2.0, 24.0, h + sin(vPos.x * 0.11) * 3.0 + cos(vPos.z * 0.09) * 3.0));
    snow *= 1.0 - smoothstep(0.5, 0.75, steep);
    vec3 ground = mix(uLow, uRock, smoothstep(0.25, 0.55, steep));
    vec3 col = mix(ground, uSnow, snow);

    float diff = max(dot(n, normalize(uSun)), 0.0);
    col *= 0.38 + 0.8 * diff;

    float minor = contour(h / uInterval, 0.15);
    float major = contour(h / (uInterval * 5.0), 0.7);
    col = mix(col, uLine, minor * 0.5);
    col = mix(col, uIndex, major * 0.85);

    float fog = smoothstep(uFogNear, uFogFar, vDist);
    gl_FragColor = vec4(mix(col, uFog, fog), 1.0);
  }
`;

function labelTexture(lines: string[], color: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const g = c.getContext("2d")!;
  g.textAlign = "center";
  g.fillStyle = color;
  g.font = "500 54px ui-monospace, Menlo, monospace";
  g.fillText(lines[0], 256, 70);
  if (lines[1]) {
    g.font = "400 38px ui-monospace, Menlo, monospace";
    g.globalAlpha = 0.75;
    g.fillText(lines[1], 256, 128);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function buildSkier() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const jacket = new THREE.MeshLambertMaterial({ color: JACKET });
  const dark = new THREE.MeshLambertMaterial({ color: "#2b231d" });
  const ski = new THREE.MeshLambertMaterial({ color: "#f4ece0" });
  const pole = new THREE.MeshLambertMaterial({ color: "#8d7e6c" });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.6, 4, 8), jacket);
  torso.position.y = 1.35;
  body.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), dark);
  head.position.y = 2.0;
  body.add(head);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.28), dark);
  pack.position.set(0, 1.45, -0.32);
  body.add(pack);

  const legs: THREE.Group[] = [];
  const skis: THREE.Mesh[] = [];
  const poles: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.17, 0.95, 0);
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.7, 4, 6), dark);
    thigh.position.y = -0.45;
    leg.add(thigh);
    body.add(leg);
    legs.push(leg);

    const s = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 2.0), ski);
    s.position.set(side * 0.2, 0.05, 0.25);
    root.add(s);
    skis.push(s);

    const p = new THREE.Group();
    p.position.set(side * 0.45, 1.55, 0.05);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.45, 5), pole);
    shaft.position.y = -0.72;
    p.add(shaft);
    body.add(p);
    poles.push(p);
  }
  return { root, body, legs, skis, poles };
}

export function createWorld(opts: {
  container: HTMLElement;
  input: Input;
  reducedMotion: boolean;
  onFrame: (f: Frame) => void;
}) {
  const { container, input, reducedMotion, onFrame } = opts;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = BG;
  const FOG_NEAR = 160;
  const FOG_FAR = 620;
  scene.fog = new THREE.Fog(BG, FOG_NEAR, FOG_FAR);

  // Portrait screens get a wider lens so the range isn't cropped to a slot.
  const fovFor = (aspect: number) => (aspect < 1 ? 74 : 58);
  const aspect0 = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(fovFor(aspect0), aspect0, 0.3, 1600);

  const sun = new THREE.Vector3(-0.5, 0.75, 0.35).normalize();
  scene.add(new THREE.HemisphereLight("#f4ece0", "#3b3028", 0.9));
  const dirLight = new THREE.DirectionalLight("#ffe2c4", 1.6);
  dirLight.position.copy(sun).multiplyScalar(100);
  scene.add(dirLight);

  // Sky dome: dark overhead, warming into the fog at the horizon.
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1400, 24, 12),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { uTop: { value: SKY_TOP }, uHorizon: { value: BG }, uGlow: { value: new THREE.Color("#5b3f2c") } },
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uTop, uHorizon, uGlow; varying vec3 vDir;
        void main(){
          float h = clamp(vDir.y, 0.0, 1.0);
          vec3 c = mix(uHorizon, uTop, smoothstep(0.0, 0.5, h));
          float glow = pow(max(dot(normalize(vec3(-0.5, 0.05, -0.8)), vDir), 0.0), 6.0);
          gl_FragColor = vec4(c + uGlow * glow * (1.0 - h), 1.0);
        }`,
    })
  );
  sky.renderOrder = -1;
  scene.add(sky);

  // ── Terrain ──
  const SEG = 300;
  const geo = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();
  const terrainMat = new THREE.ShaderMaterial({
    vertexShader: terrainVert,
    fragmentShader: terrainFrag,
    uniforms: {
      uLow: { value: LOW },
      uRock: { value: ROCK },
      uSnow: { value: SNOW },
      uLine: { value: LINE },
      uIndex: { value: INDEX },
      uFog: { value: BG },
      uSun: { value: sun },
      uInterval: { value: CONTOUR_INTERVAL },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
    },
  });
  scene.add(new THREE.Mesh(geo, terrainMat));

  // ── Trees: low conifers in the valleys for scale and depth ──
  const treeGeo = new THREE.ConeGeometry(1, 3.2, 6);
  treeGeo.translate(0, 1.6, 0);
  const treeMat = new THREE.MeshLambertMaterial({ color: "#2e3a2c" });
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, 700);
  const m4 = new THREE.Matrix4();
  let placed = 0;
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let tries = 0; tries < 6000 && placed < trees.count; tries++) {
    const x = (rand() * 2 - 1) * WORLD_HALF * 0.85;
    const z = (rand() * 2 - 1) * WORLD_HALF * 0.85;
    const y = heightAt(x, z);
    if (y > 20 || Math.hypot(x - BASE_CAMP.x, z - BASE_CAMP.z) < 30) continue;
    if (rand() < y / 20) continue; // thin out toward the treeline
    const s = 1.2 + rand() * 1.8;
    m4.compose(
      new THREE.Vector3(x, y - 0.3, z),
      new THREE.Quaternion(),
      new THREE.Vector3(s, s * (0.9 + rand() * 0.6), s)
    );
    trees.setMatrixAt(placed++, m4);
  }
  trees.count = placed;
  scene.add(trees);

  // ── Summits: a pole, a flag and a beacon you can steer by. No hint of what's up there. ──
  const summitMarkers = SUMMITS.map((s, i) => {
    const g = new THREE.Group();
    const top = heightAt(s.x, s.z);
    g.position.set(s.x, top, s.z);

    const cairn = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 0), new THREE.MeshLambertMaterial({ color: "#6b5a4b" }));
    cairn.position.y = 0.6;
    g.add(cairn);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6, 6), new THREE.MeshLambertMaterial({ color: "#c3b4a0" }));
    pole.position.y = 3;
    g.add(pole);
    const flagMat = new THREE.MeshLambertMaterial({ color: ACCENT, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.3, 8, 1), flagMat);
    flag.position.set(1.1, 5.2, 0);
    g.add(flag);

    const beaconMat = new THREE.MeshBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 3, 110, 16, 1, true), beaconMat);
    beacon.position.y = 55;
    g.add(beacon);

    const label = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: labelTexture([`▲ 0${i + 1}`, `${metres(top).toLocaleString("en-US")} m`], "#f4ece0"),
        transparent: true,
        depthWrite: false,
        fog: false,
        // Constant screen size, so a far summit's label stays legible.
        sizeAttenuation: false,
      })
    );
    label.scale.set(0.2, 0.0625, 1);
    label.position.y = 12;
    g.add(label);

    scene.add(g);
    return { g, flag, beaconMat, flagMat };
  });

  // ── Skier + skin track ──
  const skier = createSkier();
  skier.x = BASE_CAMP.x;
  skier.z = BASE_CAMP.z;
  const model = buildSkier();
  scene.add(model.root);

  const trailPositions = new Float32Array(TRAIL_MAX * 3 * 2);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
  trailGeo.setDrawRange(0, 0);
  const trail = new THREE.LineSegments(
    trailGeo,
    new THREE.LineBasicMaterial({ color: "#a08670", transparent: true, opacity: 0.85 })
  );
  scene.add(trail);
  let trailCount = 0;
  let lastTrail = { x: skier.x, z: skier.z };

  // ── Snowfall ──
  const FLAKES = reducedMotion ? 0 : 1400;
  const flakePos = new Float32Array(FLAKES * 3);
  for (let i = 0; i < FLAKES; i++) {
    flakePos[i * 3] = (Math.random() - 0.5) * 120;
    flakePos[i * 3 + 1] = Math.random() * 60;
    flakePos[i * 3 + 2] = (Math.random() - 0.5) * 120;
  }
  const flakeGeo = new THREE.BufferGeometry();
  flakeGeo.setAttribute("position", new THREE.BufferAttribute(flakePos, 3));
  const flakes = new THREE.Points(
    flakeGeo,
    new THREE.PointsMaterial({ color: "#f4ece0", size: 0.22, transparent: true, opacity: 0.7, depthWrite: false })
  );
  scene.add(flakes);

  // ── Camera rig ──
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const placeCamera = (snap: boolean) => {
    const fx = Math.sin(skier.heading);
    const fz = Math.cos(skier.heading);
    const y = heightAt(skier.x, skier.z);
    const back = 10 + Math.min(6, Math.abs(skier.speed) * 0.2);
    const want = new THREE.Vector3(skier.x - fx * back, y + 4.8, skier.z - fz * back);
    want.y = Math.max(want.y, heightAt(want.x, want.z) + 2.2);
    const look = new THREE.Vector3(skier.x + fx * 6, y + 1.6, skier.z + fz * 6);
    if (snap) {
      camPos.copy(want);
      camLook.copy(look);
    } else {
      camPos.lerp(want, 0.08);
      camLook.lerp(look, 0.15);
    }
    camera.position.copy(camPos);
    camera.lookAt(camLook);
  };
  placeCamera(true);

  let stridePhase = 0;
  let last = performance.now();
  let raf = 0;
  let time = 0;

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    const { tooSteep } = step(skier, input, dt);
    const y = heightAt(skier.x, skier.z);

    // Skier pose: yaw to heading, pitch to the slope underfoot.
    const ahead = heightAt(skier.x + Math.sin(skier.heading) * 1.2, skier.z + Math.cos(skier.heading) * 1.2);
    const behind = heightAt(skier.x - Math.sin(skier.heading) * 1.2, skier.z - Math.cos(skier.heading) * 1.2);
    model.root.position.set(skier.x, y, skier.z);
    model.root.rotation.set(0, skier.heading, 0);
    model.root.rotateX(-Math.atan2(ahead - behind, 2.4));

    // Stride: skins slide one ski forward at a time; on skis it's a quiet tuck.
    const moving = Math.abs(skier.speed) > 0.3 || tooSteep;
    if (skier.mode === "skins") {
      if (moving) stridePhase += dt * (3 + Math.abs(skier.speed) * 0.45);
      const s = Math.sin(stridePhase);
      model.skis[0].position.z = 0.25 + s * 0.45;
      model.skis[1].position.z = 0.25 - s * 0.45;
      model.legs[0].rotation.x = s * 0.35;
      model.legs[1].rotation.x = -s * 0.35;
      model.poles[0].rotation.x = -s * 0.45;
      model.poles[1].rotation.x = s * 0.45;
      model.body.position.y = reducedMotion ? 0 : Math.abs(Math.cos(stridePhase)) * 0.06;
      model.body.rotation.x = 0.12;
    } else {
      for (const sk of model.skis) sk.position.z = 0.25;
      for (const l of model.legs) l.rotation.x = 0.3;
      for (const p of model.poles) p.rotation.x = -0.9;
      model.body.position.y = -0.25;
      model.body.rotation.x = 0.35;
    }

    // Skin track — two parallel grooves laid every metre or so.
    if (Math.hypot(skier.x - lastTrail.x, skier.z - lastTrail.z) > 1.1 && trailCount < TRAIL_MAX) {
      const dx = skier.x - lastTrail.x;
      const dz = skier.z - lastTrail.z;
      const len = Math.hypot(dx, dz);
      const px = (-dz / len) * 0.22;
      const pz = (dx / len) * 0.22;
      for (const side of [-1, 1]) {
        const o = trailCount * 6;
        const ax = lastTrail.x + px * side;
        const az = lastTrail.z + pz * side;
        const bx = skier.x + px * side;
        const bz = skier.z + pz * side;
        trailPositions.set([ax, heightAt(ax, az) + 0.12, az, bx, heightAt(bx, bz) + 0.12, bz], o);
        trailCount++;
      }
      trailGeo.setDrawRange(0, trailCount * 2);
      trailGeo.attributes.position.needsUpdate = true;
      lastTrail = { x: skier.x, z: skier.z };
    }

    // Flags flutter, beacons breathe.
    for (const m of summitMarkers) {
      m.flag.rotation.y = reducedMotion ? 0 : Math.sin(time * 3 + m.g.position.x) * 0.25;
      // Fade the beam as you close in — it's for steering by, not standing in.
      const near = Math.hypot(m.g.position.x - skier.x, m.g.position.z - skier.z);
      const fade = Math.min(1, Math.max(0, (near - 12) / 50));
      m.beaconMat.opacity = (0.26 + Math.sin(time * 1.4 + m.g.position.z) * 0.06) * fade;
    }

    if (FLAKES) {
      for (let i = 0; i < FLAKES; i++) {
        const k = i * 3;
        flakePos[k + 1] -= dt * (3 + (i % 5));
        flakePos[k] += Math.sin(time + i) * dt * 0.6;
        if (flakePos[k + 1] < 0) flakePos[k + 1] += 60;
      }
      flakes.position.set(skier.x, y - 10, skier.z);
      flakeGeo.attributes.position.needsUpdate = true;
    }

    placeCamera(false);
    renderer.render(scene, camera);

    onFrame({
      x: skier.x,
      z: skier.z,
      heading: skier.heading,
      elevation: metres(y),
      speed: skier.speed,
      mode: skier.mode,
      tooSteep,
      summitId: summitAt(skier.x, skier.z)?.id,
    });
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.fov = fovFor(camera.aspect);
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", onResize);

  return {
    setMode(mode: Mode) {
      skier.mode = mode;
      if (mode === "skins") skier.speed = Math.min(skier.speed, 4);
    },
    markDiscovered(id: string) {
      const i = SUMMITS.findIndex((s) => s.id === id);
      if (i < 0) return;
      summitMarkers[i].beaconMat.color.set("#f4ece0");
      summitMarkers[i].flagMat.color.set(JACKET);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        for (const m of Array.isArray(mat) ? mat : mat ? [mat] : []) {
          (m as THREE.SpriteMaterial).map?.dispose();
          m.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

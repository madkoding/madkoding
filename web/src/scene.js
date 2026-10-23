// Escena cyberpunk (three.js). Se carga bajo demanda desde main.js.
//   cielo + estrellas · sol synthwave (como el del logo) · terreno de grilla neón
//   · skyline instanciado con ventanas procedurales · partículas de datos.
// Todo se anima en el shader (un uniforme de scroll), así que la CPU casi no trabaja por frame.
import {
  AdditiveBlending, BackSide, BoxGeometry, Color, InstancedBufferAttribute, InstancedMesh, MathUtils,
  Mesh, Object3D, PerspectiveCamera, PlaneGeometry, Points, Scene, ShaderMaterial, SphereGeometry,
  BufferGeometry, BufferAttribute, Vector3, WebGLRenderer,
} from 'three';

const PALETTE = {
  grid: new Color('#ff2bd6'),     // magenta
  gridFar: new Color('#00eae3'),  // cian
  horizon: new Color('#3a0a66'),
  sky: new Color('#0a0220'),
  zenith: new Color('#03000a'),
};

const NOISE = /* glsl */ `
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1.,0.)), f.x), mix(h21(i + vec2(0.,1.)), h21(i + vec2(1.,1.)), f.x), f.y);
  }
`;

/* ---------------------------------------------------------------- shaders */
const SKY = {
  vertex: /* glsl */ `
    varying vec3 vDir;
    void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragment: /* glsl */ `
    uniform vec3 uHorizon, uSky, uZenith; uniform float uTime;
    varying vec3 vDir;
    ${NOISE}
    void main(){
      vec3 d = normalize(vDir);
      float h = d.y;
      vec3 col = mix(uHorizon, uSky, smoothstep(0.0, 0.32, h));
      col = mix(col, uZenith, smoothstep(0.25, 0.85, h));
      col += vec3(1.0, 0.15, 0.7) * exp(-abs(h) * 14.0) * 0.55;          // halo en el horizonte
      vec2 sp = vec2(atan(d.x, d.z) * 55.0, d.y * 110.0);
      float star = step(0.992, h21(floor(sp)));
      float tw = 0.55 + 0.45 * sin(uTime * 2.0 + h21(floor(sp) + 3.0) * 40.0);
      col += vec3(0.8, 0.9, 1.0) * star * tw * smoothstep(0.08, 0.4, h);
      gl_FragColor = vec4(col, 1.0);
    }`,
};

const SUN = {
  vertex: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragment: /* glsl */ `
    uniform float uTime; varying vec2 vUv;
    void main(){
      vec2 p = vUv * 2.0 - 1.0;
      float r = length(p);
      float a = 1.0 - smoothstep(0.96, 1.0, r);
      vec3 top = vec3(1.0, 0.86, 0.12), mid = vec3(1.0, 0.36, 0.28), bot = vec3(0.95, 0.1, 0.75);
      float t = (p.y + 1.0) * 0.5;
      vec3 col = mix(bot, mid, smoothstep(0.0, 0.5, t));
      col = mix(col, top, smoothstep(0.45, 0.95, t));
      float cut = smoothstep(0.38, -0.85, p.y);                       // franjas más gruesas hacia abajo
      float band = fract(p.y * 7.5 - uTime * 0.12);
      float hole = step(band, cut * 0.9) * step(p.y, 0.32);
      gl_FragColor = vec4(col, a * (1.0 - hole));
    }`,
};

const GLOW = {
  vertex: SUN.vertex,
  fragment: /* glsl */ `
    varying vec2 vUv;
    void main(){
      float r = length(vUv * 2.0 - 1.0);
      float g = pow(max(1.0 - r, 0.0), 2.2);
      gl_FragColor = vec4(vec3(1.0, 0.2, 0.75) * g * 0.75, g);
    }`,
};

const FLOOR = {
  vertex: /* glsl */ `
    uniform float uScroll;
    varying vec3 vW; varying float vH;
    ${NOISE}
    void main(){
      vec3 p = position;
      float side = smoothstep(26.0, 74.0, abs(p.x));
      float n = vnoise(vec2(p.x * 0.045, (p.z - uScroll) * 0.045)) + 0.5 * vnoise(vec2(p.x * 0.11, (p.z - uScroll) * 0.11));
      p.y += side * n * 20.0;
      vec4 w = modelMatrix * vec4(p, 1.0);
      vW = w.xyz; vH = p.y;
      gl_Position = projectionMatrix * viewMatrix * w;
    }`,
  fragment: /* glsl */ `
    uniform float uScroll, uTime; uniform vec3 uGrid, uGridFar, uHorizon;
    varying vec3 vW; varying float vH;
    float gridLine(vec2 p, float size, float w){
      vec2 q = p / size;
      vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
      return 1.0 - min(min(g.x, g.y) / w, 1.0);
    }
    void main(){
      vec2 p = vec2(vW.x, vW.z - uScroll);
      float dist = length(vW - cameraPosition);
      float fog = smoothstep(55.0, 200.0, dist);

      float minor = gridLine(p, 4.0, 1.1) * (1.0 - smoothstep(40.0, 120.0, dist));
      float major = gridLine(p, 20.0, 1.6);
      float pulse = exp(-pow((fract((vW.z - uTime * 22.0) / 150.0) - 0.5) * 11.0, 2.0));

      vec3 lineCol = mix(uGrid, uGridFar, smoothstep(0.0, 16.0, vH));
      vec3 col = mix(vec3(0.02, 0.0, 0.06), vec3(0.07, 0.0, 0.14), smoothstep(0.0, 18.0, vH));
      col += lineCol * (minor * 0.5 + major * 0.95) * (1.0 + pulse * 1.8);

      float ax = abs(vW.x);
      float edge = 1.0 - smoothstep(0.05, 0.28, abs(ax - 7.0));          // bordes de la autopista
      float dash = step(0.5, fract(p.y / 7.0)) * (1.0 - smoothstep(0.1, 0.22, ax));
      col += uGridFar * edge * 1.3 + vec3(1.0, 0.85, 0.15) * dash * 0.95;
      col *= 1.0 - 0.55 * smoothstep(7.0, 7.4, ax) * (1.0 - smoothstep(26.0, 27.0, ax)) ;

      col = mix(col, uHorizon * 0.9, fog);
      gl_FragColor = vec4(col, 1.0);
    }`,
};

const TOWER = {
  vertex: /* glsl */ `
    attribute float aSeed;
    uniform float uScroll, uLen, uNear;
    varying vec3 vLocal, vN, vDim, vW; varying float vSeed;
    void main(){
      mat4 im = instanceMatrix;
      vec3 scale = vec3(length(im[0].xyz), length(im[1].xyz), length(im[2].xyz));
      vec3 wp = (modelMatrix * im * vec4(position, 1.0)).xyz;
      float d = mod(-im[3].z - uScroll, uLen);                     // el edificio avanza hacia la cámara y reaparece al fondo
      wp.z += (-(d + uNear)) - im[3].z;
      vLocal = position * scale; vDim = scale; vN = normal; vSeed = aSeed; vW = wp;
      gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
    }`,
  fragment: /* glsl */ `
    uniform float uTime; uniform vec3 uHorizon, uGrid, uGridFar;
    varying vec3 vLocal, vN, vDim, vW; varying float vSeed;
    ${NOISE}
    void main(){
      vec3 n = normalize(vN);
      float dist = length(vW - cameraPosition);
      vec3 col = vec3(0.012, 0.004, 0.035);
      vec3 edgeCol = mix(uGrid, uGridFar, step(0.5, fract(vSeed * 7.31)));
      float ew = 0.1 + dist * 0.0055;

      if (abs(n.y) > 0.5) {                                         // azotea
        float ex = min(vDim.x * 0.5 - abs(vLocal.x), vDim.z * 0.5 - abs(vLocal.z));
        col += edgeCol * (1.0 - smoothstep(0.0, ew, ex)) * 1.1;
      } else {
        bool sx = abs(n.x) > 0.5;
        float hz = sx ? vLocal.z : vLocal.x;
        float hd = (sx ? vDim.z : vDim.x) * 0.5;
        vec2 fc = vec2(hz + hd, vLocal.y);
        vec2 cell = floor(fc / vec2(1.7, 2.4));
        vec2 f = fract(fc / vec2(1.7, 2.4));
        float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.22, f.y) * step(f.y, 0.78);
        float fw = max(fwidth(fc.x) / 1.7, fwidth(fc.y) / 2.4);        // ventanas subpíxel: se promedian para evitar el ruido
        float r = h21(cell + vSeed * 91.0 + (sx ? 7.0 : 0.0));
        float lit = step(0.56, r);
        lit *= mix(1.0, step(0.5, fract(uTime * 0.45 + r * 13.0)), step(0.965, r));   // algunas luces parpadean
        float k = h21(cell + 11.0 + vSeed * 17.0);
        vec3 wc = k < 0.38 ? vec3(0.0, 0.92, 0.89) : k < 0.62 ? vec3(1.0, 0.17, 0.84) : k < 0.85 ? vec3(1.0, 0.82, 0.2) : vec3(0.85, 0.95, 1.0);
        col += wc * mix(0.3 * lit, win * lit, 1.0 - smoothstep(0.3, 0.8, fw)) * 0.95;
        float e = min(hd - abs(hz), vDim.y - vLocal.y);
        col += edgeCol * (1.0 - smoothstep(0.0, ew, e)) * 0.95;
        col += uGrid * 0.10 * exp(-vLocal.y * 0.12);                // brillo en la base
      }
      float fog = smoothstep(60.0, 185.0, dist);
      gl_FragColor = vec4(mix(col, uHorizon * 0.9, fog), 1.0);
    }`,
};

const DUST = {
  vertex: /* glsl */ `
    attribute float aSeed;
    uniform float uTime, uScroll, uPx;
    varying float vA; varying vec3 vC;
    void main(){
      vec3 p = position;
      float d = mod(-p.z - uScroll * 0.85, 190.0);
      p.z = -(d - 16.0);
      p.y = mod(p.y + uTime * (0.35 + aSeed * 0.9), 46.0) + 0.3;
      p.x += sin(uTime * 0.35 + aSeed * 40.0) * 1.4;
      vec4 mv = viewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = clamp((0.14 + aSeed * 0.28) * uPx / max(-mv.z, 0.1), 1.0, 14.0);
      vA = smoothstep(190.0, 60.0, d) * smoothstep(0.0, 6.0, d) * (0.45 + 0.55 * sin(uTime * 2.2 + aSeed * 60.0));
      vC = aSeed < 0.4 ? vec3(0.0, 0.92, 0.89) : aSeed < 0.7 ? vec3(1.0, 0.17, 0.84) : aSeed < 0.9 ? vec3(0.32, 1.0, 0.0) : vec3(1.0, 0.85, 0.2);
    }`,
  fragment: /* glsl */ `
    varying float vA; varying vec3 vC;
    void main(){
      float r = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, r);
      gl_FragColor = vec4(vC, a * a * vA);
    }`,
};

/* ------------------------------------------------------------------ utils */
function rng(seed) {                                                 // mulberry32: escena idéntica en cada visita
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOOP = { start() {}, stop() {}, setReducedMotion() {}, dispose() {} };

/* ------------------------------------------------------------------ escena */
export function createScene(canvas, opts = {}) {
  const low = opts.quality === 'low';
  let reduce = !!opts.reduceMotion;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !low, alpha: false, powerPreference: 'high-performance' });
  } catch {
    opts.onFail?.();
    return NOOP;
  }
  let pixelRatio = Math.min(devicePixelRatio || 1, low ? 1.25 : 1.75);
  const scene = new Scene();
  scene.background = PALETTE.zenith;
  const camera = new PerspectiveCamera(58, 1, 0.1, 700);

  const shared = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uHorizon: { value: PALETTE.horizon },
    uGrid: { value: PALETTE.grid },
    uGridFar: { value: PALETTE.gridFar },
  };
  const material = (shader, uniforms = {}, extra = {}) =>
    new ShaderMaterial({ vertexShader: shader.vertex, fragmentShader: shader.fragment, uniforms: { ...shared, ...uniforms }, ...extra });

  // Cielo
  const sky = new Mesh(
    new SphereGeometry(460, 24, 16),
    material(SKY, { uSky: { value: PALETTE.sky }, uZenith: { value: PALETTE.zenith } }, { side: BackSide, depthWrite: false }),
  );
  sky.renderOrder = -10;
  scene.add(sky);

  // Sol + resplandor
  const glow = new Mesh(new PlaneGeometry(300, 300), material(GLOW, {}, { transparent: true, depthWrite: false, blending: AdditiveBlending }));
  glow.position.set(0, 22, -262);
  const sun = new Mesh(new PlaneGeometry(92, 92), material(SUN, {}, { transparent: true, depthWrite: false }));
  sun.position.set(0, 25, -258);
  sun.renderOrder = -5;
  scene.add(glow, sun);

  // Terreno
  const seg = low ? 64 : 130;
  const floorGeo = new PlaneGeometry(320, 320, seg, seg);
  floorGeo.rotateX(-Math.PI / 2);
  const floor = new Mesh(floorGeo, material(FLOOR));
  floor.position.set(0, 0, -130);
  floor.frustumCulled = false;
  scene.add(floor);

  // Skyline
  const LEN = 190, NEAR = -16;
  const perSide = low ? 34 : 78;
  const towerGeo = new BoxGeometry(1, 1, 1);
  towerGeo.translate(0, 0.5, 0);
  const towers = new InstancedMesh(towerGeo, material(TOWER, { uLen: { value: LEN }, uNear: { value: NEAR } }), perSide * 2);
  const seeds = new Float32Array(perSide * 2);
  const rand = rng(1337);
  const dummy = new Object3D();
  let idx = 0;
  for (const side of [-1, 1]) {
    for (let i = 0; i < perSide; i++) {
      const w = 3 + rand() * 6, dep = 3 + rand() * 6;
      const h = 8 + Math.pow(rand(), 2.7) * 40;
      dummy.position.set(side * (13 + rand() * 22 + w / 2), 0, -((i + rand() * 0.8) / perSide) * LEN);
      dummy.scale.set(w, h, dep);
      dummy.updateMatrix();
      towers.setMatrixAt(idx, dummy.matrix);
      seeds[idx++] = rand();
    }
  }
  towerGeo.setAttribute('aSeed', new InstancedBufferAttribute(seeds, 1));
  towers.frustumCulled = false;
  scene.add(towers);

  // Partículas
  const count = low ? 260 : 620;
  const pos = new Float32Array(count * 3), pseed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos.set([(rand() - 0.5) * 120, rand() * 46, -rand() * 190], i * 3);
    pseed[i] = rand();
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(pos, 3));
  dustGeo.setAttribute('aSeed', new BufferAttribute(pseed, 1));
  const dustMat = material(DUST, { uPx: { value: 600 } }, { transparent: true, depthWrite: false, blending: AdditiveBlending });
  const dust = new Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  scene.add(dust);

  /* ------------------------------------------------------------ cámara/ratón */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
  };
  let tilt = false;
  const onTilt = (e) => {                                            // móviles: el giro del teléfono mueve la cámara
    if (e.gamma == null) return;
    tilt = true;
    mouse.tx = MathUtils.clamp(e.gamma / 30, -1, 1);
    mouse.ty = MathUtils.clamp(((e.beta ?? 45) - 45) / 30, -1, 1);
  };
  let scrollP = 0, scrollY = window.scrollY, scrollVel = 0;
  const onScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollP = MathUtils.clamp(window.scrollY / max, 0, 1);
  };

  const target = new Vector3();
  const updateCamera = () => {
    camera.position.set(mouse.x * 2.2, 2.9 + scrollP * 2.6 - mouse.y * 0.5, 8);
    target.set(mouse.x * 4, 6.2 + scrollP * 7 - mouse.y * 1.2, -80);
    camera.lookAt(target);
  };

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = 58 + (1 - Math.min(camera.aspect, 1)) * 38;         // en vertical se abre el campo para ver el skyline
    camera.updateProjectionMatrix();
    dustMat.uniforms.uPx.value = (h * pixelRatio) / (2 * Math.tan(MathUtils.degToRad(camera.fov) / 2));
    if (!running) draw();
  }

  /* ----------------------------------------------------------------- bucle */
  let running = false, raf = 0, last = 0, speed = 0, frames = 0, ema = 16, drops = 0, clock = 0;

  function draw() {
    updateCamera();
    renderer.render(scene, camera);
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    const dy = window.scrollY - scrollY; scrollY = window.scrollY;
    scrollVel += ((dt > 0 ? dy / dt : 0) - scrollVel) * Math.min(dt * 8, 1);
    const targetSpeed = reduce ? 0 : 9 + Math.min(Math.abs(scrollVel) / 55, 34);   // al hacer scroll la autopista acelera
    speed += (targetSpeed - speed) * Math.min(dt * 3, 1);
    clock += dt;
    shared.uTime.value = clock;
    shared.uScroll.value += speed * dt;
    mouse.x += (mouse.tx - mouse.x) * Math.min(dt * 3, 1);
    mouse.y += (mouse.ty - mouse.y) * Math.min(dt * 3, 1);
    draw();

    // Calidad adaptativa: si el equipo no da la talla, baja la resolución y, en último caso, apaga la escena.
    if (++frames > 20) {
      ema += (dt * 1000 - ema) * 0.08;
      if (frames % 90 === 0 && ema > 26) {
        if (pixelRatio > 0.8) { pixelRatio = Math.max(0.75, pixelRatio - 0.35); drops++; resize(); }
        else if (ema > 45) { stop(); opts.onSlow?.(); }
      }
    }
  }

  function start() {
    if (running) return;
    canvas.hidden = false;
    onScroll();
    if (reduce) { shared.uTime.value = 1.5; draw(); return; }        // movimiento reducido: un único fotograma
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onVisibility = () => { if (document.hidden) stop(); else if (document.documentElement.dataset.fx !== 'off') start(); };
  const onLost = (e) => { e.preventDefault(); stop(); };
  const onRestored = () => { if (document.documentElement.dataset.fx !== 'off') start(); };

  addEventListener('resize', resize);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('pointermove', onPointer, { passive: true });
  addEventListener('deviceorientation', onTilt, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  resize();
  start();

  return {
    start,
    stop() { stop(); canvas.hidden = true; },
    setReducedMotion(v) { reduce = v; stop(); start(); if (v) { speed = 0; draw(); } },
    dispose() {
      stop();
      removeEventListener('resize', resize);
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onPointer);
      removeEventListener('deviceorientation', onTilt);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
    },
  };
}

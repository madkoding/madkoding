// Interacción de la landing: idioma, efectos de UI, filtros, estado "en vivo" y escena 3D (carga diferida).
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const html = document.documentElement;

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* modo privado */ } },
};

/* ------------------------------------------------------------------ idioma */
const TITLES = {
  es: 'madKoding — VTuber, VR y software',
  en: 'madKoding — VTuber, VR and software',
};
let lang = html.lang === 'en' ? 'en' : 'es';
const langListeners = [];

function applyLang(next, persist = true) {
  lang = next;
  html.lang = lang;
  document.title = TITLES[lang];
  if (persist) store.set('lang', lang);
  $$('[data-ia]').forEach((el) => {
    const map = JSON.parse(el.dataset.ia);
    for (const [attr, val] of Object.entries(map)) el.setAttribute(attr, val[lang] ?? val.es);
  });
  const btn = $('#lang .tool__txt');
  if (btn) btn.textContent = lang === 'es' ? 'EN' : 'ES';
  langListeners.forEach((fn) => fn(lang));
}

$('#lang')?.addEventListener('click', () => applyLang(lang === 'es' ? 'en' : 'es'));

/* ------------------------------------------------------- roles (máquina de escribir) */
const roleEl = $('#role');
if (roleEl) {
  const roles = JSON.parse(roleEl.dataset.roles);
  let timer = 0;
  let run = 0;

  const startTyping = () => {
    clearTimeout(timer);
    const id = ++run;
    const list = roles[lang];
    if (motionQuery.matches) { roleEl.textContent = list[0]; return; }
    let i = 0, n = 0, deleting = false;
    const tick = () => {
      if (id !== run) return;
      const word = list[i % list.length];
      n += deleting ? -1 : 1;
      roleEl.textContent = word.slice(0, n);
      let wait = deleting ? 28 : 65;
      if (!deleting && n === word.length) { deleting = true; wait = 1700; }
      else if (deleting && n === 0) { deleting = false; i++; wait = 350; }
      timer = setTimeout(tick, wait);
    };
    tick();
  };
  langListeners.push(startTyping);
  motionQuery.addEventListener?.('change', startTyping);
  startTyping();
}

/* ------------------------------------------------- revelado al hacer scroll */
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window && !motionQuery.matches) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }),
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  );
  revealEls.forEach((el, i) => {
    el.style.setProperty('--d', `${(i % 6) * 55}ms`);
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

/* --------------------------------------- navegación: sección activa + scroll */
{
  const links = new Map($$('[data-nav]').map((a) => [a.dataset.nav, a]));
  const sections = ['redes', 'proyectos', 'contacto'].map((id) => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        links.get(e.target.id)?.setAttribute('aria-current', 'true');
      }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => spy.observe(s));
  }
  const hint = $('.hero__scroll');
  const shade = $('.fx__shade');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    hint?.classList.toggle('is-gone', scrollY > 80);
    // El fondo 3D se atenúa al salir del hero para que el contenido se lea con comodidad.
    shade?.style.setProperty('--dim', Math.min(1, Math.max(0, (scrollY - innerHeight * 0.15) / (innerHeight * 0.6))).toFixed(3));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
}

/* ------------------- paneles: foco de luz que sigue al cursor + inclinación 3D */
if (finePointer) {
  $$('[data-fx]').forEach((el) => {
    let raf = 0;
    el.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        if (!motionQuery.matches) {
          el.style.setProperty('--rx', `${((0.5 - y / r.height) * 5).toFixed(2)}deg`);
          el.style.setProperty('--ry', `${((x / r.width - 0.5) * 7).toFixed(2)}deg`);
        }
      });
    });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    });
  });

  // Resplandor global que sigue al puntero (solo transform: no invalida estilos).
  const glow = $('#glow');
  if (glow && !motionQuery.matches) {
    let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, active = false;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; if (!active) { active = true; loop(); } }, { passive: true });
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      glow.classList.add('is-on');
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.5) requestAnimationFrame(loop); else active = false;
    };
  }
}

/* ------------------------------------------------- proyectos: filtros y búsqueda */
{
  const list = $('#projects');
  const items = $$('#projects > li');
  const chips = $$('.chip');
  const input = $('#q');
  const count = $('#count');
  const empty = $('#empty');
  const tpl = JSON.parse(count.dataset.tpl);
  const total = Number(count.dataset.total);
  const state = { cat: 'all', q: '' };

  const render = () => {
    let n = 0;
    const q = state.q.trim().toLowerCase();
    items.forEach((li) => {
      const okCat = state.cat === 'all' || li.dataset.cat.split(' ').includes(state.cat);
      const okQ = !q || q.split(/\s+/).every((w) => li.dataset.q.includes(w));
      const show = okCat && okQ;
      li.hidden = !show;
      if (show) { n++; li.classList.add('in'); }
    });
    count.textContent = tpl[lang].replace('{n}', n).replace('{total}', total);
    empty.hidden = n > 0;
    list.hidden = n === 0;
  };

  chips.forEach((chip) => chip.addEventListener('click', () => {
    state.cat = chip.dataset.cat;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    render();
  }));
  input.addEventListener('input', () => { state.q = input.value; render(); });
  $('#reset').addEventListener('click', () => {
    state.cat = 'all'; state.q = ''; input.value = '';
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === 'all')));
    render();
    input.focus();
  });
  addEventListener('keydown', (e) => {
    const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      input.focus({ preventScroll: false });
      input.select();
    } else if (e.key === 'Escape' && document.activeElement === input) {
      if (input.value) { input.value = ''; state.q = ''; render(); } else input.blur();
    }
  });
  langListeners.push(render);
  render();
}

/* ------------------------------------------------------- copiar email + aviso */
{
  const btn = $('#copy');
  const toast = $('#toast');
  const msgs = JSON.parse(toast.dataset.msg);
  let t = 0;
  const say = (key) => {
    toast.textContent = msgs[key][lang];
    toast.classList.add('is-on');
    clearTimeout(t);
    t = setTimeout(() => toast.classList.remove('is-on'), 2200);
  };
  if (btn && (navigator.clipboard || document.queryCommandSupported?.('copy'))) {
    btn.hidden = false;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.email;
      try {
        if (navigator.clipboard) await navigator.clipboard.writeText(text);
        else {
          const ta = Object.assign(document.createElement('textarea'), { value: text });
          document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
        }
        say('ok');
      } catch { say('fail'); }
    });
  }
}

/* ------------------------------------------------------ estado "en vivo" (Twitch) */
{
  const badge = $('[data-social="twitch"] .live-badge');
  const meta = $('#livemeta');
  const POLL = 60_000;
  let timer = 0;

  const setLive = (data) => {
    const live = !!data?.live;
    html.toggleAttribute('data-live', live);
    if (badge) badge.hidden = !live;
    $('.avatar__live').hidden = !live;
    if (meta) {
      meta.hidden = !live;
      if (live) {
        const bits = [data.title, data.game, data.viewers != null ? `${data.viewers} 👁` : ''].filter(Boolean);
        meta.textContent = bits.join(' · ');
      }
    }
  };

  const poll = async () => {
    if (document.hidden) return schedule();
    try {
      const res = await fetch('/api/live', { headers: { accept: 'application/json' } });
      if (!res.ok) return; // sin endpoint (preview local): no se vuelve a consultar
      setLive(await res.json());
    } catch { /* sin red: se reintenta */ }
    schedule();
  };
  const schedule = () => { clearTimeout(timer); timer = setTimeout(poll, POLL); };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
  poll();
}

/* ---------------------------------------------------------------- escena 3D */
{
  const canvas = $('#bg');
  const fxBtn = $('#fx');
  let scene = null;
  let loading = null;

  const supportsWebGL = () => {
    try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
  };
  const saveData = navigator.connection?.saveData === true;
  const eligible = supportsWebGL() && !saveData;

  const quality = () => {
    const weak = (navigator.hardwareConcurrency || 4) <= 2 || (navigator.deviceMemory || 4) <= 2;
    return weak || innerWidth < 720 ? 'low' : 'high';
  };

  const enable = async () => {
    html.setAttribute('data-fx', 'on');
    if (scene) return scene.start();
    loading ??= import('./scene.js').then((m) => {
      scene = m.createScene(canvas, {
        quality: quality(),
        reduceMotion: motionQuery.matches,
        onFail: () => { html.classList.add('no-webgl'); fxBtn.hidden = true; scene = null; loading = null; },
        // Equipo demasiado lento: se apagan los efectos solo por esta visita; el botón 3D permite reactivarlos.
        onSlow: () => { html.setAttribute('data-fx', 'off'); html.classList.remove('fx-ready'); fxBtn.setAttribute('aria-pressed', 'false'); },
      });
      html.classList.add('fx-ready');
      return scene;
    }).catch(() => { html.classList.add('no-webgl'); fxBtn.hidden = true; loading = null; });
    await loading;
  };
  const disable = () => { html.setAttribute('data-fx', 'off'); html.classList.remove('fx-ready'); scene?.stop(); };

  if (!eligible) {
    html.classList.add('no-webgl');
  } else {
    fxBtn.hidden = false;
    const sync = () => fxBtn.setAttribute('aria-pressed', String(html.dataset.fx !== 'off'));
    sync();
    fxBtn.addEventListener('click', () => {
      const on = html.dataset.fx === 'off';
      store.set('fx', on ? 'on' : 'off');
      on ? enable() : disable();
      sync();
    });
    motionQuery.addEventListener?.('change', () => scene?.setReducedMotion(motionQuery.matches));
    if (html.dataset.fx !== 'off') {
      // Se difiere para no competir con el primer pintado.
      ('requestIdleCallback' in window ? requestIdleCallback : (f) => setTimeout(f, 200))(() => enable(), { timeout: 1200 });
    }
  }
}

applyLang(lang, false);

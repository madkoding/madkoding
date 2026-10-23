import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../api/live.js';

const makeRes = () => {
  const res = { headers: {}, code: 200, body: undefined };
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (c) => { res.code = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  return res;
};
const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });
const env = { TWITCH_CLIENT_ID: 'id', TWITCH_CLIENT_SECRET: 'secret' };

test('sin credenciales responde offline sin llamar a Twitch', async () => {
  let calls = 0;
  const handler = createHandler({ env: {}, fetchImpl: async () => { calls++; } });
  const res = makeRes();
  await handler({ method: 'GET' }, res);
  assert.deepEqual(res.body, { live: false, configured: false });
  assert.equal(calls, 0);
});

test('rechaza métodos que no son GET/HEAD', async () => {
  const res = makeRes();
  await createHandler({ env })({ method: 'POST' }, res);
  assert.equal(res.code, 405);
});

test('en vivo: devuelve título, juego y espectadores y cachea 60 s', async () => {
  const urls = [];
  const fetchImpl = async (url, opts) => {
    urls.push(url);
    if (url.includes('oauth2/token')) return json({ access_token: 'tok', expires_in: 3600 });
    assert.equal(opts.headers.Authorization, 'Bearer tok');
    assert.equal(opts.headers['Client-Id'], 'id');
    return json({ data: [{ type: 'live', title: 'Tetris', game_name: 'Tetr.io', viewer_count: 42, started_at: 'x' }] });
  };
  const res = makeRes();
  await createHandler({ env, fetchImpl })({ method: 'GET' }, res);
  assert.deepEqual(res.body, { live: true, configured: true, title: 'Tetris', game: 'Tetr.io', viewers: 42, startedAt: 'x' });
  assert.match(res.headers['Cache-Control'], /s-maxage=60/);
  assert.ok(urls.some((u) => u.includes('user_login=madkoding')));
});

test('offline: lista vacía', async () => {
  const fetchImpl = async (url) => (url.includes('oauth2') ? json({ access_token: 't', expires_in: 100 }) : json({ data: [] }));
  const res = makeRes();
  await createHandler({ env, fetchImpl })({ method: 'GET' }, res);
  assert.deepEqual(res.body, { live: false, configured: true });
});

test('reutiliza el token y lo renueva si Twitch responde 401', async () => {
  let tokens = 0, streams = 0;
  const fetchImpl = async (url) => {
    if (url.includes('oauth2')) { tokens++; return json({ access_token: `t${tokens}`, expires_in: 3600 }); }
    streams++;
    return streams === 2 ? json({}, 401) : json({ data: [] });
  };
  const handler = createHandler({ env, fetchImpl });
  await handler({ method: 'GET' }, makeRes());          // token 1
  assert.equal(tokens, 1);
  await handler({ method: 'GET' }, makeRes());          // 401 → renueva token y reintenta
  assert.equal(tokens, 2);
});

test('si Twitch falla, responde offline con error y caché corta', async () => {
  const res = makeRes();
  await createHandler({ env, fetchImpl: async () => { throw new Error('red'); } })({ method: 'GET' }, res);
  assert.equal(res.code, 200);
  assert.deepEqual(res.body, { live: false, configured: true, error: true });
  assert.match(res.headers['Cache-Control'], /s-maxage=30/);
});

// GET /api/live → { live, configured, title?, game?, viewers?, startedAt? }
// Consulta la API de Twitch (Helix) con el flujo "client credentials".
// Variables de entorno en Vercel: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET (y opcional TWITCH_LOGIN).
// Sin credenciales responde { live: false, configured: false } y la página simplemente no muestra el aviso.
// La respuesta se cachea en el CDN de Vercel 60 s: da igual cuántos visitantes haya, Twitch recibe ~1 consulta por minuto.

const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const STREAMS_URL = 'https://api.twitch.tv/helix/streams';

export function createHandler({ env = process.env, fetchImpl = globalThis.fetch, now = Date.now } = {}) {
  let token = null;
  let tokenExpires = 0;

  async function getToken(clientId, clientSecret, force = false) {
    if (!force && token && now() < tokenExpires - 60_000) return token;
    const res = await fetchImpl(TOKEN_URL, {
      method: 'POST',
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' }),
    });
    if (!res.ok) throw new Error(`token ${res.status}`);
    const json = await res.json();
    token = json.access_token;
    tokenExpires = now() + (json.expires_in ?? 3600) * 1000;
    return token;
  }

  async function fetchStream(login, clientId, clientSecret) {
    const call = async (force) => {
      const bearer = await getToken(clientId, clientSecret, force);
      return fetchImpl(`${STREAMS_URL}?user_login=${encodeURIComponent(login)}`, {
        headers: { 'Client-Id': clientId, Authorization: `Bearer ${bearer}` },
      });
    };
    let res = await call(false);
    if (res.status === 401) res = await call(true); // token revocado o vencido
    if (!res.ok) throw new Error(`streams ${res.status}`);
    return (await res.json()).data?.[0];
  }

  return async function handler(req, res) {
    if (req.method && !['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      return res.status(405).json({ error: 'method not allowed' });
    }

    const clientId = env.TWITCH_CLIENT_ID;
    const clientSecret = env.TWITCH_CLIENT_SECRET;
    const login = (env.TWITCH_LOGIN || 'madkoding').toLowerCase();

    if (!clientId || !clientSecret) {
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      return res.status(200).json({ live: false, configured: false });
    }

    try {
      const stream = await fetchStream(login, clientId, clientSecret);
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
      if (!stream || stream.type !== 'live') return res.status(200).json({ live: false, configured: true });
      return res.status(200).json({
        live: true,
        configured: true,
        title: stream.title,
        game: stream.game_name,
        viewers: stream.viewer_count,
        startedAt: stream.started_at,
      });
    } catch {
      // Si Twitch falla no se rompe la página: se responde "offline" y se reintenta pronto.
      res.setHeader('Cache-Control', 'public, s-maxage=30');
      return res.status(200).json({ live: false, configured: true, error: true });
    }
  };
}

export default createHandler();

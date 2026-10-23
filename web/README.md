# madkoding.vercel.app — landing

Landing cyberpunk (HTML + CSS + three.js) con las redes sociales y los enlaces a todos los proyectos.
Design system tomado de [madkoding.carrd.co](https://madkoding.carrd.co): Inter / Bakbak One,
morado `#9E00FF`, verde `#52FF00`, avatar con glow, iconos de marca y botones pill.

- **Estática y rápida**: el HTML se genera en el build; sin JS ya se ve todo (en español).
- **Escena 3D** (three.js, carga diferida): autopista synthwave, sol del logo, skyline neón y partículas.
  Acelera al hacer scroll y reacciona al puntero / giro del teléfono.
- **ES / EN**: ambos idiomas van en el HTML; se elige por idioma del navegador y se recuerda.
- **Amigable**: dock inferior en móvil, búsqueda y filtros de proyectos (`/` para buscar), copiar email,
  botón `3D` para apagar efectos, respeta `prefers-reduced-motion` y `Save-Data`, y cae a un degradado
  si no hay WebGL o el equipo es lento.
- **"EN VIVO" de Twitch** vía función serverless (opcional).

## Estructura

```
web/
├── content/
│   ├── site.json        # perfil, lore, redes (ES/EN)
│   ├── projects.json    # proyectos (se sincroniza con readme.source.md)
│   └── ui.json          # textos de la interfaz (ES/EN)
├── src/                 # index.html (plantilla), styles.css, main.js, scene.js (three.js), init.js
├── public/img/          # logo, avatar, favicons, imagen OG
├── api/live.js          # función serverless: estado en vivo de Twitch
├── scripts/             # build.mjs, serve.mjs, sync-projects.mjs
├── tests/               # node --test (API, sync y contenido)
└── vercel.json          # build, caché y cabeceras de seguridad (CSP)
```

## Deploy en Vercel

1. [vercel.com/new](https://vercel.com/new) → importa `madkoding/madkoding`.
2. **Root Directory: `web`**. El resto lo toma de `vercel.json` (build `npm run build`, salida `dist`).
3. Deploy. Cada push a `main` redespliega y cada PR genera un preview.

### Estado "EN VIVO" de Twitch (opcional)

1. Crea una app en [dev.twitch.tv/console](https://dev.twitch.tv/console/apps) (Category: Website Integration,
   OAuth Redirect URL: `http://localhost`).
2. Copia el **Client ID** y genera un **Client Secret**.
3. En Vercel → *Settings → Environment Variables* agrega `TWITCH_CLIENT_ID` y `TWITCH_CLIENT_SECRET`
   (opcional `TWITCH_LOGIN`, por defecto `madkoding`) y redespliega.

Sin esas variables la página funciona igual, solo no muestra el aviso. La respuesta se cachea 60 s en el CDN.

### Dominio propio

*Settings → Domains* en Vercel (por ejemplo `links.tudominio.com`, con un CNAME a `cname.vercel-dns.com`).
Las URLs canónica / Open Graph se toman solas de `VERCEL_PROJECT_PRODUCTION_URL`; para forzar otra, define `SITE_URL`.

## Editar contenido

| Qué | Dónde |
| --- | --- |
| Bio, lore, roles, redes | `content/site.json` |
| Textos de interfaz | `content/ui.json` |
| Proyectos | `content/projects.json` (o edita `readme.source.md`, ver abajo) |
| Colores y estilo | tokens en `:root` de `src/styles.css` |
| Look de la escena 3D | `PALETTE` y shaders en `src/scene.js` |

Los iconos de marca viven en `scripts/icons.mjs`.

### Proyectos sincronizados con el README

El workflow `sync-projects` corre cuando cambia `readme.source.md` y actualiza `content/projects.json`
(nombre, URL, tags y descripción en inglés). **No pisa** lo editado a mano: descripción en español,
`category`, `featured` y `kind`. Un proyecto nuevo entra con `needsTranslation: true`; revisa su traducción
y categorías (`ai`, `systems`, `hardware`, `web`). Para correrlo a mano: `npm run sync:projects`.

## Desarrollo

```sh
cd web
npm install
npm run dev        # build + http://localhost:8080 (aplica los mismos headers/CSP que Vercel)
npm test           # API de Twitch, sync de proyectos y contenido ES/EN
```

`npm run build` genera `dist/` con CSS/JS con hash y caché inmutable. three.js va en un chunk aparte
(~140 kB gzip) que solo se descarga si el equipo soporta WebGL2 y no hay `Save-Data`.

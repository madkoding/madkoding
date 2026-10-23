# madkoding.vercel.app — landing

Landing estática (HTML + CSS, sin build) con las redes sociales y los enlaces a los proyectos.
El design system está tomado de [madkoding.carrd.co](https://madkoding.carrd.co): tipografías
Inter / Bakbak One, degradado morado → azul → verde, avatar con glow `#9E00FF`, iconos en círculo
con los colores de cada red y botones pill.

## Estructura

```
site/
├── index.html      # contenido: hero, lore, redes, proyectos, contacto
├── styles.css      # tokens de diseño en :root + componentes
└── assets/         # logo, avatar, banner, favicons, imagen OG
vercel.json         # (raíz del repo) sirve site/ como sitio estático
```

## Deploy en Vercel

1. En [vercel.com/new](https://vercel.com/new) importa el repo `madkoding/madkoding`.
2. Deja **Root Directory** en la raíz y **Framework Preset** en `Other`.
   `vercel.json` ya indica que no hay build y que la salida es `site/`.
3. Deploy. Cada push a `main` redepliega; cada PR genera un preview.
4. Opcional: en *Settings → Domains* agrega tu dominio y actualiza las URLs
   `canonical` / `og:url` / `og:image` en `index.html`.

También funciona con la CLI: `npx vercel` desde la raíz del repo.

## Editar contenido

- **Redes**: cada `<li>` dentro de `ul.socials`. El color del círculo sale de `style="--brand: var(--twitch)"`;
  los colores por red viven en `:root` de `styles.css`.
- **Proyectos**: cada `<li>` dentro de `ul.projects`. Usa `project__kind--site` para páginas propias
  y la etiqueta por defecto para repos de GitHub.
- **Iconos**: sprite `<svg>` al inicio de `index.html` (`#i-twitch`, `#i-x`, …).

## Previsualizar en local

```sh
npx serve site        # o: python3 -m http.server -d site 8080
```

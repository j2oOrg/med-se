# MED.se Updated Site

Updated React/Vite implementation of the public MED.se website.

The app uses a static content snapshot exported from the live public site and keeps
original public image URLs for people, places, posts, and page heroes.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

Refresh the local content snapshot from the live site:

```bash
npm run export:data
```

The exporter reads the public frontend bundle from `https://www.med.se`, discovers
the public Supabase endpoint used by that bundle, and writes the resulting content
to `src/data/med-data.json`.

## Notes

- Generated output in `dist/`, local screenshots, logs, and `node_modules/` are
  intentionally ignored.
- The build currently emits a Vite chunk-size warning because the site includes a
  large static content snapshot. The production build still succeeds.

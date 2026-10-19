# Archive

Pages and content that are no longer routed, kept here so the writing and the
screenshots survive. Nothing in this folder is imported by the app, so CRA never
bundles it — these files are reference material, not dead code paths.

- `CoffeeChats.js` — Airtable-embedded coffee chat signup page.
- `Resources.js`, `ResourcesButton.js`, `resources-content/` — the resources
  page: start-here, Git/GitHub, web dev, data science and design guides. It still
  imports `../css/Resources.module.css`, `../css/ResourcesButton.module.css` and
  `../../images/*`, all of which stay in `src/`, so dropping any of these back
  into `src/components/` and re-adding a route is all it takes to bring the page
  back.

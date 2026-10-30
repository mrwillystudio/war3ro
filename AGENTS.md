# RO ATLAS maintenance
Read `SITE_UPDATE_RULES.md` before changing models, catalog data, or the site UI.
These are user-approved persistent requirements, not a request to delegate work.
The active website version is `Ro-Online 7.0b07`. Preserve game data and the world-map correction workspace.
Item-card labels are defined in `tools/catalog/item-card-tags.js` and embedded in `index.html`; keep them synchronized.
Run `node tools/catalog/test_catalog_tags.cjs .` after any item-label update.
Model previews use individual 10–15 degree left offsets and hide only foot-level hero glow; follow the full policy for new models too.
Never call a local artifact or staging branch a completed production deployment. Verify the deployed site first.

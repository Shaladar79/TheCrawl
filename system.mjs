// system.mjs (root)
// Keep this file small. Everything should be imported from /scripts.

import { initTheCrawl } from "./scripts/init.mjs";

Hooks.once("init", async () => {
  await initTheCrawl();
});


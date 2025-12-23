// system.mjs (root)
// Keep this file small. Everything should be imported from /scripts.

import { initTheCrawl } from "./scripts/init.mjs";
import { TheCrawlItem } from "./scripts/documents/item.mjs";

Hooks.once("init", async () => {
  // Register custom Item document (auto-key generation, future hooks)
  CONFIG.Item.documentClass = TheCrawlItem;

  await initTheCrawl();
});

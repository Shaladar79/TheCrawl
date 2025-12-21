// scripts/init.mjs
import { registerSystemSettings } from "./config/register-settings.mjs";
import { registerHandlebarsHelpers } from "./handlebars/register-helpers.mjs";
import { preloadHandlebarsTemplates } from "./templates/preload-templates.mjs";
import { registerSheets } from "./sheets/register-sheets.mjs";

import { TheCrawlActor } from "./documents/actor.mjs";
import { TheCrawlItem } from "./documents/item.mjs";

export async function initTheCrawl() {
  console.log("The Crawl | Initializing");

  // Expose config namespace if you want it later.
  CONFIG.THECRAWL = CONFIG.THECRAWL ?? {};

  // Document classes (safe to set now; the stubs do nothing special yet)
  CONFIG.Actor.documentClass = TheCrawlActor;
  CONFIG.Item.documentClass = TheCrawlItem;

  registerSystemSettings();
  registerHandlebarsHelpers();

  await preloadHandlebarsTemplates();
  registerSheets();

  console.log("The Crawl | Ready");
}


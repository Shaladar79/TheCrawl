// scripts/sheets/register-sheets.mjs
import { TheCrawlActorSheet } from "./actor-sheet.mjs";
import { TheCrawlTalentSheet } from "./skill-sheet.mjs";

export function registerSheets() {
  // Actor sheet
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("thecrawl", TheCrawlActorSheet, {
    types: ["pc", "npc", "monster", "companion", "summon"],
    makeDefault: true
  });

  // Item sheet: Talent (Item type "skill")
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("thecrawl", TheCrawlTalentSheet, {
    types: ["skill"],
    makeDefault: true
  });

  console.log("The Crawl | Sheets registered");
}

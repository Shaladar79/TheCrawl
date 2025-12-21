// scripts/sheets/register-sheets.mjs
import { TheCrawlActorSheet } from "./actor-sheet.mjs";
import { TheCrawlTalentSheet } from "./skill-sheet.mjs";
import { TheCrawlEquipmentSheet } from "./equipment-sheet.mjs";

export function registerSheets() {
  // Actor sheet
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("thecrawl", TheCrawlActorSheet, {
    types: ["pc", "npc", "monster", "companion", "summon"],
    makeDefault: true
  });

 // Item sheets
Items.unregisterSheet("core", ItemSheet);

Items.registerSheet("thecrawl", TheCrawlTalentSheet, {
  types: ["skill"],
  makeDefault: true
});

Items.registerSheet("thecrawl", TheCrawlEquipmentSheet, {
  types: ["equipment"],
  makeDefault: true
});

  console.log("The Crawl | Sheets registered");
}

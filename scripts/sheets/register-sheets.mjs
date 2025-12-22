// scripts/sheets/register-sheets.mjs

import { TheCrawlActorSheet } from "./actor-sheet.mjs";

// Item sheets
import { TheCrawlSkillSheet } from "./skill-sheet.mjs";
import { TheCrawlTalentSheet } from "./talent-sheet.mjs";
import { TheCrawlRaceSheet } from "./race-sheet.mjs";
import { TheCrawlEquipmentSheet } from "./equipment-sheet.mjs";
import { TheCrawlFeatureSheet } from "./feature-sheet.mjs";

export function registerSheets() {
  // -----------------------------
  // Actor sheet
  // -----------------------------
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("thecrawl", TheCrawlActorSheet, {
    types: ["pc", "npc", "monster", "companion", "summon"],
    makeDefault: true
  });

  // -----------------------------
  // Item sheets
  // -----------------------------
  Items.unregisterSheet("core", ItemSheet);

  Items.registerSheet("thecrawl", TheCrawlSkillSheet,    { types: ["skill"],    makeDefault: true });
  Items.registerSheet("thecrawl", TheCrawlTalentSheet,   { types: ["talent"],   makeDefault: true });
  Items.registerSheet("thecrawl", TheCrawlRaceSheet,     { types: ["race"],     makeDefault: true });
  Items.registerSheet("thecrawl", TheCrawlEquipmentSheet,{ types: ["equipment"],makeDefault: true });
  Items.registerSheet("thecrawl", TheCrawlFeatureSheet,  { types: ["feature"],  makeDefault: true });

  console.log("The Crawl | Sheets registered");
}

// scripts/sheets/register-sheets.mjs

import { TheCrawlActorSheet } from "./actor-sheet.mjs";

// Item sheets
import { TheCrawlSkillSheet } from "./skill-sheet.mjs";
import { TheCrawlTalentSheet } from "./talent-sheet.mjs";
import { TheCrawlRaceSheet } from "./race-sheet.mjs";
import { TheCrawlEquipmentSheet } from "./equipment-sheet.mjs";

export function registerSheets() {

  /* -------------------------------------------- */
  /* Actor Sheet                                  */
  /* -------------------------------------------- */

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("thecrawl", TheCrawlActorSheet, {
    types: ["pc", "npc", "monster", "companion", "summon"],
    makeDefault: true
  });

  /* -------------------------------------------- */
  /* Item Sheets                                  */
  /* -------------------------------------------- */

  // Explicitly unregister core sheets by type
  Items.unregisterSheet("core", ItemSheet);

  // Skill
  Items.registerSheet("thecrawl", TheCrawlSkillSheet, {
    types: ["skill"],
    makeDefault: true
  });

  // Talent
  Items.registerSheet("thecrawl", TheCrawlTalentSheet, {
    types: ["talent"],
    makeDefault: true
  });

  // Race
  Items.registerSheet("thecrawl", TheCrawlRaceSheet, {
    types: ["race"],
    makeDefault: true
  });

  // Equipment
  Items.registerSheet("thecrawl", TheCrawlEquipmentSheet, {
    types: ["equipment"],
    makeDefault: true
  });

  console.log("The Crawl | Sheets registered");
}

  console.log("The Crawl | Sheets registered");
}

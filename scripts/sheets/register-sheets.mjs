// scripts/sheets/register-sheets.mjs
import { TheCrawlActorSheet } from "./actor-sheet.mjs";

export function registerSheets() {
  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("thecrawl", TheCrawlActorSheet, {
    types: ["pc", "npc", "monster", "companion", "summon"],
    makeDefault: true
  });

  console.log("The Crawl | Actor sheet registered");
}

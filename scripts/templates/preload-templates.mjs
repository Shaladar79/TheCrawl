// scripts/templates/preload-templates.mjs
export async function preloadHandlebarsTemplates() {
  const templatePaths = [
    // Shell
    "systems/thecrawl/templates/actor/actor-sheet.hbs",

    // Top-level parts
    "systems/thecrawl/templates/actor/parts/header.hbs",
    "systems/thecrawl/templates/actor/parts/tabs.hbs",
    "systems/thecrawl/templates/actor/parts/tab-core.hbs",
    "systems/thecrawl/templates/actor/parts/tab-combat.hbs",
    "systems/thecrawl/templates/actor/parts/tab-notes.hbs",

    // Core sub-parts
    "systems/thecrawl/templates/actor/parts/core/progression.hbs",
    "systems/thecrawl/templates/actor/parts/core/identity-monster.hbs",
    "systems/thecrawl/templates/actor/parts/core/identity-companion.hbs",
    "systems/thecrawl/templates/actor/parts/core/identity-summon.hbs",
    "systems/thecrawl/templates/actor/parts/core/attributes.hbs",
    "systems/thecrawl/templates/actor/parts/core/resources.hbs",
    "systems/thecrawl/templates/actor/parts/core/derived.hbs",

    // Combat sub-parts
    "systems/thecrawl/templates/actor/parts/combat/combat-stats.hbs",
    "systems/thecrawl/templates/actor/parts/combat/combat-monster-flags.hbs"
  ];

  await loadTemplates(templatePaths);
}

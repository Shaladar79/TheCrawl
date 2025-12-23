// scripts/templates/preload-templates.mjs
export async function preloadHandlebarsTemplates() {
  const templatePaths = [
    // Actor shell + parts
    "systems/thecrawl/templates/actor/actor-sheet.hbs",
    "systems/thecrawl/templates/actor/parts/header.hbs",
    "systems/thecrawl/templates/actor/parts/tabs.hbs",
    "systems/thecrawl/templates/actor/parts/tab-core.hbs",
    "systems/thecrawl/templates/actor/parts/tab-combat.hbs",
    "systems/thecrawl/templates/actor/parts/tab-notes.hbs",
    "systems/thecrawl/templates/actor/parts/tab-abilities.hbs",

    "systems/thecrawl/templates/actor/parts/core/progression.hbs",
    "systems/thecrawl/templates/actor/parts/core/identity-monster.hbs",
    "systems/thecrawl/templates/actor/parts/core/identity-companion.hbs",
    "systems/thecrawl/templates/actor/parts/core/identity-summon.hbs",
    "systems/thecrawl/templates/actor/parts/core/attributes.hbs",
    "systems/thecrawl/templates/actor/parts/core/resources.hbs",
    "systems/thecrawl/templates/actor/parts/core/derived.hbs",

    "systems/thecrawl/templates/actor/parts/combat/combat-stats.hbs",
    "systems/thecrawl/templates/actor/parts/combat/combat-monster-flags.hbs",

   // Talent (Item type: skill)
    "systems/thecrawl/templates/items/skill-sheet.hbs",
    "systems/thecrawl/templates/items/parts/skill/header.hbs",
    "systems/thecrawl/templates/items/parts/skill/details.hbs",
    "systems/thecrawl/templates/items/parts/skill/action.hbs",
    "systems/thecrawl/templates/items/parts/skill/costs.hbs",
    "systems/thecrawl/templates/items/parts/skill/scaling.hbs",
    "systems/thecrawl/templates/items/parts/skill/description.hbs",
    "systems/thecrawl/templates/items/parts/skill/rules.hbs",

  // Equipment (Item type: equipment)
    "systems/thecrawl/templates/items/equipment-sheet.hbs",
    "systems/thecrawl/templates/items/parts/equipment/header.hbs",
    "systems/thecrawl/templates/items/parts/equipment/details.hbs",
    "systems/thecrawl/templates/items/parts/equipment/weapon.hbs",
    "systems/thecrawl/templates/items/parts/equipment/armor.hbs",
    "systems/thecrawl/templates/items/parts/equipment/consumable.hbs",
    "systems/thecrawl/templates/items/parts/equipment/description.hbs",

  // Feature templates
    "systems/thecrawl/templates/items/feature-sheet.hbs",
    "systems/thecrawl/templates/items/parts/feature/header.hbs",
    "systems/thecrawl/templates/items/parts/feature/details.hbs",
    "systems/thecrawl/templates/items/parts/feature/description.hbs",

  // Talent templates
    "systems/thecrawl/templates/items/talent-sheet.hbs",
    "systems/thecrawl/templates/items/parts/talent/header.hbs",
    "systems/thecrawl/templates/items/parts/talent/details.hbs",
    "systems/thecrawl/templates/items/parts/talent/action.hbs",
    "systems/thecrawl/templates/items/parts/talent/costs.hbs",
    "systems/thecrawl/templates/items/parts/talent/scaling.hbs",
    "systems/thecrawl/templates/items/parts/talent/description.hbs",

  // Race templates
    "systems/thecrawl/templates/items/race-sheet.hbs",
    "systems/thecrawl/templates/items/parts/race/header.hbs",
    "systems/thecrawl/templates/items/parts/race/details.hbs",
    "systems/thecrawl/templates/items/parts/race/grants.hbs",
    "systems/thecrawl/templates/items/parts/race/description.hbs"

  ];

  return loadTemplates(templatePaths);
}

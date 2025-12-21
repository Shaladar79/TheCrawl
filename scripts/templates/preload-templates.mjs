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
    "systems/thecrawl/templates/item/skill-sheet.hbs",
    "systems/thecrawl/templates/item/parts/skill/header.hbs",
    "systems/thecrawl/templates/item/parts/skill/details.hbs",
    "systems/thecrawl/templates/item/parts/skill/action.hbs",
    "systems/thecrawl/templates/item/parts/skill/costs.hbs",
    "systems/thecrawl/templates/item/parts/skill/scaling.hbs",
    "systems/thecrawl/templates/item/parts/skill/description.hbs",

    // Equipment (Item type: equipment)
    "systems/thecrawl/templates/item/equipment-sheet.hbs",
    "systems/thecrawl/templates/item/parts/equipment/header.hbs",
    "systems/thecrawl/templates/item/parts/equipment/details.hbs",
    "systems/thecrawl/templates/item/parts/equipment/weapon.hbs",
    "systems/thecrawl/templates/item/parts/equipment/armor.hbs",
    "systems/thecrawl/templates/item/parts/equipment/consumable.hbs",
    "systems/thecrawl/templates/item/parts/equipment/description.hbs"
  ];

  return loadTemplates(templatePaths);
}

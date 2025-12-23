// scripts/sheets/skill-sheet.mjs
export class TheCrawlSkillSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["thecrawl", "sheet", "item", "skill"],
      width: 620,
      height: 720,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }],

      // v13: ensure form changes actually submit to the document
      submitOnChange: true,
      submitOnClose: true
    });
  }

  get template() {
    return "systems/thecrawl/templates/items/skill-sheet.hbs";
  }

  async getData(options = {}) {
    const data = await super.getData(options);

    // Must match Actor attribute keys (template.json Actor.templates.base.attributes)
    data.attributeOptions = ["might", "agility", "endurance", "insight", "willpower", "charisma"];

    // Skill category is a controlled vocabulary (dropdown)
    // Keep "skill" and "spellSchool" as the important ones for talent validation.
    data.skillCategories = [
      "skill",
      "spellSchool",
      "weapon",
      "lore",
      "craft",
      "social",
      "other"
    ];

    // Tier dropdown (0-10 for now; easy to extend later)
    data.tierOptions = Array.from({ length: 11 }, (_, i) => i);

    data.itemLabel = "Skill";
    return data;
  }
}

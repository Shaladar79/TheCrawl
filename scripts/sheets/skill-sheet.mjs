// scripts/sheets/skill-sheet.mjs
export class TheCrawlSkillSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["thecrawl", "sheet", "item", "skill"],
      width: 620,
      height: 720,
      tabs: [
        { navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }
      ]
    });
  }

  get template() {
    return "systems/thecrawl/templates/items/skill-sheet.hbs";
  }

  async getData(options = {}) {
    const data = await super.getData(options);
    data.attributeOptions = ["might", "agility", "endurance", "insight", "willpower", "charisma"];
    data.itemLabel = "Skill";
    return data;
  }
}

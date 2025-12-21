// scripts/sheets/skill-sheet.mjs
export class TheCrawlTalentSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["thecrawl", "sheet", "item", "talent"],
      width: 620,
      height: 720,
      tabs: [
        { navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }
      ]
    });
  }

  get template() {
    return "systems/thecrawl/templates/item/skill-sheet.hbs";
  }

  async getData(options = {}) {
    const data = await super.getData(options);

    // Provide select options for dropdowns
    data.actionTypes = ["passive", "active"];
    data.attributeOptions = ["might", "agility", "endurance", "insight", "willpower", "charisma"];

    // A small display label for the sheet (Talent = skill item)
    data.itemLabel = "Talent";

    return data;
  }
}

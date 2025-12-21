// scripts/sheets/talent-sheet.mjs
export class TheCrawlTalentSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["thecrawl", "sheet", "item", "talent"],
      width: 640,
      height: 760,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }]
    });
  }

  get template() {
    return "systems/thecrawl/templates/items/talent-sheet.hbs";
  }

  async getData(options = {}) {
    const data = await super.getData(options);

    data.actionTypes = ["passive", "active"];
    data.attributeOptions = ["might", "agility", "endurance", "insight", "willpower", "charisma"];
    data.itemLabel = "Talent";

    return data;
  }
}

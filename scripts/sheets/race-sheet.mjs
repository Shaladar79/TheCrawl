// scripts/sheets/race-sheet.mjs
export class TheCrawlRaceSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["thecrawl", "sheet", "item", "race"],
      width: 640,
      height: 720,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }]
    });
  }

  get template() {
    return "systems/thecrawl/templates/items/race-sheet.hbs";
  }

  async getData(options = {}) {
    const data = await super.getData(options);

    // Options used by dropdowns in the template
    data.attributeOptions = ["might", "agility", "endurance", "insight", "willpower", "charisma"];
    data.itemLabel = "Race";

    return data;
  }
}

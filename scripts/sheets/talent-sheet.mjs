// scripts/sheets/talent-sheet.mjs
export class TheCrawlTalentSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["thecrawl", "sheet", "item", "talent"],
      width: 640,
      height: 760,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }],

      // v13: ensure form changes submit correctly
      submitOnChange: true,
      submitOnClose: true
    });
  }

  get template() {
    return "systems/thecrawl/templates/items/talent-sheet.hbs";
  }

  async getData(options = {}) {
    const data = await super.getData(options);

    // Talents are only action-based (spells or special attacks)
    data.actionTypes = ["active"];

    // Governing attribute options
    data.attributeOptions = ["might", "agility", "endurance", "insight", "willpower", "charisma"];

    // Talent subtype (spell vs special attack)
    data.talentSubtypes = ["spell", "specialAttack"];

    // Placeholder list for later dropdown use
    data.weaponTypes = [
      "unarmed",
      "dagger",
      "sword",
      "axe",
      "mace",
      "spear",
      "polearm",
      "bow",
      "crossbow",
      "staff",
      "wand"
    ];

    data.itemLabel = "Talent";
    return data;
  }
}

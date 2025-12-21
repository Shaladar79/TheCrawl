// scripts/sheets/equipment-sheet.mjs
export class TheCrawlEquipmentSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["thecrawl", "sheet", "item", "equipment"],
      width: 640,
      height: 760,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }]
    });
  }

  get template() {
    return "systems/thecrawl/templates/item/equipment-sheet.hbs";
  }

  async getData(options = {}) {
    const data = await super.getData(options);

    data.equipmentCategories = ["weapon", "armor", "consumable", "misc"];
    data.itemLabel = "Equipment";

    // Ensure category exists so the template can render deterministic conditionals
    data.system = data.system ?? data.item?.system ?? {};
    if (!data.system.category) data.system.category = "misc";

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Re-render when category changes so the correct block appears immediately
    html.find('select[name="system.category"]').on("change", async (ev) => {
      const value = ev.currentTarget.value;
      await this.item.update({ "system.category": value });
      this.render(false);
    });
  }
}

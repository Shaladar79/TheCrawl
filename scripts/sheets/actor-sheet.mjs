// scripts/sheets/actor-sheet.mjs
export class TheCrawlActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["thecrawl", "sheet", "actor"],
      width: 720,
      height: 780,
      tabs: [
        { navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "core" }
      ]
    });
  }

  get template() {
    return "systems/thecrawl/templates/actor/actor-sheet.hbs";
  }

  async getData(options = {}) {
    const data = await super.getData(options);

    // Convenience flags for HBS
    const actorType = this.actor.type;

    data.isPC = actorType === "pc";
    data.isNPC = actorType === "npc";
    data.isMonster = actorType === "monster";
    data.isCompanion = actorType === "companion";
    data.isSummon = actorType === "summon";

    // Ensure sheetMode exists
    const sys = data.system ?? data.actor?.system ?? {};
    if (!sys.meta) sys.meta = {};
    if (!sys.meta.sheetMode) sys.meta.sheetMode = "auto";

    data.system = sys;

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Re-render when sheet mode changes (purely UI toggling)
    html.find('select[name="system.meta.sheetMode"]').on("change", async (ev) => {
      const value = ev.currentTarget.value;
      await this.actor.update({ "system.meta.sheetMode": value });
      this.render(false);
    });
  }
}

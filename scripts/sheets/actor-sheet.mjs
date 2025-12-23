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

    // ---------------------------------------------------
    // Talents validation (Actor-based rules)
    // ---------------------------------------------------
    const talents = this.actor.items?.filter(i => i.type === "talent") ?? [];

    data.talentsValidated = talents.map(t => {
      const result = this.actor.validateTalent(t);
      return {
        id: t.id,
        name: t.name,
        img: t.img,
        subtype: String(t?.system?.subtype ?? "").trim(),
        ok: !!result.ok,
        warnings: result.warnings ?? []
      };
    });

    // Optional: stable ordering (name)
    data.talentsValidated.sort((a, b) => String(a.name).localeCompare(String(b.name)));

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

    // Open owned item sheets from our list
    html.find("[data-open-item]").on("click", (ev) => {
      ev.preventDefault();
      const li = ev.currentTarget.closest("[data-item-id]");
      const itemId = li?.dataset?.itemId;
      if (!itemId) return;

      const item = this.actor.items.get(itemId);
      if (item) item.sheet.render(true);
    });
  }
}

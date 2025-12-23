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

    data.talentsValidated.sort((a, b) => String(a.name).localeCompare(String(b.name)));

    // ---------------------------------------------------
    // Skills list (owned items, display-only)
    // Attribute = system.governingAttribute
    // Tier      = system.tier
    // Score     = system.bonus.misc
    // ---------------------------------------------------
    const skills = this.actor.items?.filter(i => i.type === "skill") ?? [];

    data.skillsList = skills.map(s => ({
      id: s.id,
      name: s.name,
      img: s.img,
      attribute: String(s?.system?.governingAttribute ?? "").trim(),
      tier: Number(s?.system?.tier ?? 0),
      score: Number(s?.system?.bonus?.misc ?? 0)
    }));

    data.skillsList.sort((a, b) => String(a.name).localeCompare(String(b.name)));

    return data;
  }

  /**
   * Prompt for TN/context, then execute a skill roll.
   */
  async _promptSkillRollOptions(skillItemId) {
    const item = this.actor.items.get(skillItemId);
    const skillName = item?.name ?? "Skill";

    // Default context: noncombat
    const content = `
      <form class="thecrawl-roll-dialog">
        <div class="form-group">
          <label>Target Number (TN)</label>
          <input type="number" name="tn" placeholder="(optional)" />
          <p class="notes">Leave blank to roll without a TN comparison.</p>
        </div>

        <div class="form-group">
          <label>Context</label>
          <select name="context">
            <option value="noncombat" selected>Non-Combat</option>
            <option value="combat">Combat</option>
          </select>
        </div>
      </form>
    `;

    return new Promise((resolve) => {
      new Dialog({
        title: `Roll ${skillName}`,
        content,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d12"></i>',
            label: "Roll",
            callback: async (html) => {
              const tnRaw = html.find('input[name="tn"]').val();

              // Blank => no TN
              const tn = (tnRaw === "" || tnRaw === null || tnRaw === undefined)
                ? null
                : Number(tnRaw);

              // If they typed something non-numeric, treat as no TN (safe)
              const tnFinal = Number.isFinite(tn) ? tn : null;

              const context = String(html.find('select[name="context"]').val() ?? "").trim();

              try {
                await this.actor.rollSkill(skillItemId, { tn: tnFinal, context });
              } catch (err) {
                console.error("The Crawl | rollSkill failed", err);
                ui.notifications?.error("Skill roll failed. See console for details.");
              }

              resolve(true);
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => resolve(false)
          }
        },
        default: "roll",
        close: () => resolve(false)
      }).render(true);
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Re-render when sheet mode changes (purely UI toggling)
    html.find('select[name="system.meta.sheetMode"]').on("change", async (ev) => {
      const value = ev.currentTarget.value;
      await this.actor.update({ "system.meta.sheetMode": value });
      this.render(false);
    });

    // Open owned item sheets from our lists
    html.find("[data-open-item]").on("click", (ev) => {
      ev.preventDefault();
      const li = ev.currentTarget.closest("[data-item-id]");
      const itemId = li?.dataset?.itemId;
      if (!itemId) return;

      const item = this.actor.items.get(itemId);
      if (item) item.sheet.render(true);
    });

    // Roll skill (Dialog prompt → actor.rollSkill(itemId, { tn, context }))
    html.find("[data-roll-skill]").on("click", async (ev) => {
      ev.preventDefault();
      const li = ev.currentTarget.closest("[data-item-id]");
      const itemId = li?.dataset?.itemId;
      if (!itemId) return;

      if (typeof this.actor.rollSkill !== "function") {
        ui.notifications?.warn("rollSkill is not implemented yet.");
        return;
      }

      await this._promptSkillRollOptions(itemId);
    });
  }
}

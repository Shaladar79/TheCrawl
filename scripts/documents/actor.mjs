// scripts/documents/actor.mjs

export class TheCrawlActor extends Actor {
  /**
   * Return owned Skill items (Item type = "skill")
   */
  getOwnedSkills() {
    return this.items?.filter(i => i.type === "skill") ?? [];
  }

  /**
   * Check whether the actor has a spell school skill by its system.key.
   * Used to validate spell Talents (talent.subtype === "spell").
   *
   * @param {string} spellSchoolKey
   * @returns {boolean}
   */
  hasSpellSchool(spellSchoolKey) {
    const key = String(spellSchoolKey ?? "").trim();
    if (!key) return false;

    const skills = this.getOwnedSkills();
    return skills.some(s => String(s?.system?.key ?? "").trim() === key);
  }

  prepareDerivedData() {
    super.prepareDerivedData();

    const system = this.system ?? {};

    // ---------------------------------------------
    // Collect modifiers from owned items (no math yet)
    // ---------------------------------------------
    const collectedModifiers = [];

    for (const item of this.items) {
      const mods = item?.system?.modifiers;

      if (Array.isArray(mods) && mods.length) {
        for (const m of mods) {
          collectedModifiers.push({
            itemId: item.id,
            itemName: item.name,
            itemType: item.type,
            ...m
          });
        }
      }
    }

    system.debug = system.debug ?? {};
    system.debug.collectedModifiers = collectedModifiers;

    // ---------------------------------------------
    // Debug: list spell schools known to this actor
    // ---------------------------------------------
    const skillKeys = this.getOwnedSkills()
      .map(s => String(s?.system?.key ?? "").trim())
      .filter(Boolean);

    system.debug.spellSchools = skillKeys;
  }
}

// scripts/documents/actor.mjs

export class TheCrawlActor extends Actor {
  /**
   * Return owned Skill items (Item type = "skill")
   */
  getOwnedSkills() {
    return this.items?.filter(i => i.type === "skill") ?? [];
  }

  /**
   * Return owned Equipment items (Item type = "equipment")
   */
  getOwnedEquipment() {
    return this.items?.filter(i => i.type === "equipment") ?? [];
  }

  /**
   * Return equipped weapons (equipment items where category === "weapon" and equipped === true)
   */
  getEquippedWeapons() {
    const eq = this.getOwnedEquipment();
    return eq.filter(i => {
      const sys = i?.system ?? {};
      return sys.category === "weapon" && !!sys.equipped;
    });
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

  /**
   * Check whether the actor has an equipped weapon matching the required weapon type.
   * Used to validate special attack Talents (talent.subtype === "specialAttack").
   *
   * @param {string} weaponType
   * @returns {boolean}
   */
  hasEquippedWeaponType(weaponType) {
    const req = String(weaponType ?? "").trim();
    if (!req) return false;

    const weapons = this.getEquippedWeapons();
    return weapons.some(w => String(w?.system?.weapon?.type ?? "").trim() === req);
  }

  /**
   * Validate whether this actor meets the requirements to use a given Talent.
   * Non-blocking: returns ok + warnings. No enforcement or dice penalties yet.
   *
   * @param {Item} talent
   * @returns {{ ok: boolean, warnings: string[] }}
   */
  validateTalent(talent) {
    const warnings = [];

    if (!talent || talent.type !== "talent") {
      return { ok: false, warnings: ["Invalid talent item."] };
    }

    const sys = talent.system ?? {};
    const subtype = String(sys.subtype ?? "").trim();

    if (subtype === "spell") {
      const schoolKey = String(sys?.requirements?.spellSchoolKey ?? "").trim();

      if (!schoolKey) {
        warnings.push("Spell is missing required spell school key (requirements.spellSchoolKey).");
      } else if (!this.hasSpellSchool(schoolKey)) {
        warnings.push(`Actor lacks required spell school skill: "${schoolKey}".`);
      }
    } else if (subtype === "specialAttack") {
      const weaponType = String(sys?.requirements?.weaponType ?? "").trim();

      if (!weaponType) {
        warnings.push("Special attack is missing required weapon type (requirements.weaponType).");
      } else if (!this.hasEquippedWeaponType(weaponType)) {
        warnings.push(`Actor does not have an equipped weapon of type: "${weaponType}".`);
      }
    } else {
      warnings.push(`Unknown talent subtype "${subtype}". Expected "spell" or "specialAttack".`);
    }

    return { ok: warnings.length === 0, warnings };
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

    // ---------------------------------------------
    // Debug: list equipped weapon types known to this actor
    // ---------------------------------------------
    const equippedWeaponTypes = this.getEquippedWeapons()
      .map(w => String(w?.system?.weapon?.type ?? "").trim())
      .filter(Boolean);

    system.debug.equippedWeaponTypes = equippedWeaponTypes;

    // Optional: clear lastTalentValidation (will be set by future UI/roll calls)
    system.debug.lastTalentValidation = system.debug.lastTalentValidation ?? null;
  }
}

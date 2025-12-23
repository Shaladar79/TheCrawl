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

      if (!schoolKey) warnings.push("Spell is missing required spell school key (requirements.spellSchoolKey).");
      else if (!this.hasSpellSchool(schoolKey)) warnings.push(`Actor lacks required spell school skill: "${schoolKey}".`);
    } else if (subtype === "specialAttack") {
      const weaponType = String(sys?.requirements?.weaponType ?? "").trim();

      if (!weaponType) warnings.push("Special attack is missing required weapon type (requirements.weaponType).");
      else if (!this.hasEquippedWeaponType(weaponType)) warnings.push(`Actor does not have an equipped weapon of type: "${weaponType}".`);
    } else {
      warnings.push(`Unknown talent subtype "${subtype}". Expected "spell" or "specialAttack".`);
    }

    return { ok: warnings.length === 0, warnings };
  }

  // -------------------------------------------------------
  // Dice helpers (d12 success system)
  // -------------------------------------------------------

  /**
   * Attribute dice mapping:
   *  5-10  = 1 die
   * 11-20  = 2 dice
   * 21-35  = 3 dice
   * 36-55  = 4 dice
   * 56-79  = 5 dice
   *
   * NOTE: 80+ handled via auto-successes (implemented in rollSkill).
   */
  _attributeToDice(attrValue) {
    const v = Number(attrValue ?? 0);

    if (v >= 56 && v <= 79) return 5;
    if (v >= 36 && v <= 55) return 4;
    if (v >= 21 && v <= 35) return 3;
    if (v >= 11 && v <= 20) return 2;
    if (v >= 5 && v <= 10) return 1;

    return 0;
  }

  /**
   * Skill dice mapping (Score):
   *  1-10  = 1 die
   * 11-20  = 2 dice
   * 21-30  = 3 dice
   * 31-40  = 4 dice
   * 41-50  = 5 dice
   *
   * NOTE: 51+ handled via auto-successes (implemented in rollSkill).
   */
  _scoreToDice(score) {
    const v = Number(score ?? 0);

    if (v >= 41 && v <= 50) return 5;
    if (v >= 31 && v <= 40) return 4;
    if (v >= 21 && v <= 30) return 3;
    if (v >= 11 && v <= 20) return 2;
    if (v >= 1 && v <= 10) return 1;

    return 0;
  }

  /**
   * Auto-success rules (IMPLEMENTED):
   * - Attribute 80+ grants auto-successes (no extra dice beyond the 5-die cap)
   * - Skill score 51+ grants auto-successes (no extra dice beyond the 5-die cap)
   *
   * Conservative scaling:
   * - Attribute: +1 at 80, +1 per additional full +20 thereafter (100, 120, ...)
   * - Skill:     +1 at 51, +1 per additional full +20 thereafter (71, 91, ...)
   *
   * Returns: { attributeAuto, skillAuto, totalAuto }
   */
  _computeAutoSuccesses(attrValue, score) {
    const a = Number(attrValue ?? 0);
    const s = Number(score ?? 0);

    const attributeAuto = a >= 80 ? (1 + Math.floor((a - 80) / 20)) : 0;
    const skillAuto = s >= 51 ? (1 + Math.floor((s - 51) / 20)) : 0;

    return {
      attributeAuto,
      skillAuto,
      totalAuto: attributeAuto + skillAuto
    };
  }

  /**
   * Evaluate d12 results:
   * 10-11 = +1 success
   * 12    = +2 successes
   * 1     = -1 success
   *
   * Floor dice-net at -3 (auto-successes are added after this floor).
   */
  _countSuccessesFromD12(results) {
    let successes = 0;

    for (const r of results) {
      if (r === 12) successes += 2;
      else if (r >= 10) successes += 1; // 10-11
      else if (r === 1) successes -= 1;
    }

    if (successes < -3) successes = -3;
    return successes;
  }

  /**
   * Roll a Skill from the actor sheet list.
   * Uses:
   * - governingAttribute => Actor system.attributes[attribute].value
   * - Score             => skill.system.bonus.misc
   *
   * Optional:
   * - options.tn      => Target Number (compare net successes vs TN)
   * - options.context => "combat" | "noncombat" (label only for now)
   *
   * Posts a chat message with the roll breakdown.
   */
  async rollSkill(itemId, options = {}) {
    const skill = this.items.get(itemId);
    if (!skill || skill.type !== "skill") {
      ui.notifications?.warn("That is not a Skill item.");
      return null;
    }

    const { tn = null, context = "" } = options ?? {};
    const hasTN = Number.isFinite(Number(tn));
    const tnValue = hasTN ? Number(tn) : null;
    const ctx = String(context ?? "").trim(); // label only

    const skillSys = skill.system ?? {};
    const attrKey = String(skillSys.governingAttribute ?? "").trim();
    const score = Number(skillSys?.bonus?.misc ?? 0);

    const attrValue = Number(this.system?.attributes?.[attrKey]?.value ?? 0);

    const attrDice = this._attributeToDice(attrValue);
    const skillDice = this._scoreToDice(score);

    const totalDice = Math.max(0, attrDice + skillDice);

    // Auto-successes from high Attribute / Score (no extra dice; additive successes)
    const auto = this._computeAutoSuccesses(attrValue, score);

    // Roll d12 pool (allow 0 dice: still produce a message)
    let roll = null;
    let results = [];

    if (totalDice > 0) {
      roll = await (new Roll(`${totalDice}d12`)).evaluate();
      results = roll.dice?.[0]?.results?.map(r => r.result) ?? [];
    }

    const diceNet = this._countSuccessesFromD12(results);
    const netSuccesses = diceNet + auto.totalAuto;

    // TN compare (optional)
    const margin = hasTN ? (netSuccesses - tnValue) : null;
    const outcome = hasTN ? (margin >= 0 ? "SUCCESS" : "FAIL") : null;

    const title = `${this.name} rolls ${skill.name}`;
    const breakdown = `
      <div style="margin-top:6px;">
        <div><strong>Attribute:</strong> ${attrKey || "(none)"} (${attrValue}) → ${attrDice}d</div>
        <div><strong>Score:</strong> ${score} → ${skillDice}d</div>
        <div><strong>Total Dice:</strong> ${totalDice}d12</div>
        ${ctx ? `<div><strong>Context:</strong> ${ctx}</div>` : ``}
      </div>
    `;

    const resultsLine = totalDice > 0
      ? `<div style="margin-top:6px;"><strong>Dice:</strong> [${results.join(", ")}]</div>`
      : `<div style="margin-top:6px;"><strong>Dice:</strong> (no dice)</div>`;

    const autoLine = (auto.totalAuto > 0)
      ? `
        <div style="margin-top:6px;">
          <div><strong>Auto Successes:</strong> ${auto.totalAuto}
            <span style="opacity:0.85;">
              (Attr: ${auto.attributeAuto}, Score: ${auto.skillAuto})
            </span>
          </div>
        </div>
      `
      : ``;

    const tnLine = hasTN
      ? `
        <div style="margin-top:6px;">
          <div><strong>Target Number:</strong> ${tnValue}</div>
          <div><strong>Outcome:</strong> ${outcome} <span style="opacity:0.85;">(Margin: ${margin})</span></div>
        </div>
      `
      : ``;

    const scoring = `
      <div style="margin-top:6px;">
        <div><strong>Net Successes:</strong> ${netSuccesses}</div>
        <div style="opacity:0.85; margin-top:4px;">
          Rules: 10–11 = +1, 12 = +2, 1 = −1 (floor −3)
        </div>
      </div>
    `;

    const content = `
      <div class="thecrawl-chat-roll">
        <h3 style="margin:0;">${title}</h3>
        ${breakdown}
        ${resultsLine}
        ${autoLine}
        ${tnLine}
        ${scoring}
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content,
      roll: roll ?? undefined,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL
    });

    // Optional: store last skill roll debug
    this.system.debug = this.system.debug ?? {};
    this.system.debug.lastSkillRoll = {
      skillId: skill.id,
      skillName: skill.name,
      attribute: attrKey,
      attributeValue: attrValue,
      score,
      attrDice,
      skillDice,
      totalDice,
      autoSuccesses: {
        attributeAuto: auto.attributeAuto,
        skillAuto: auto.skillAuto,
        totalAuto: auto.totalAuto
      },
      results,
      diceNet,
      netSuccesses,
      tn: tnValue,
      context: ctx || null,
      margin,
      outcome
    };

    return { roll, results, diceNet, autoSuccesses: auto, netSuccesses, tn: tnValue, margin, outcome, context: ctx };
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

    // Debug: list spell schools known to this actor
    const skillKeys = this.getOwnedSkills()
      .map(s => String(s?.system?.key ?? "").trim())
      .filter(Boolean);

    system.debug.spellSchools = skillKeys;

    // Debug: list equipped weapon types known to this actor
    const equippedWeaponTypes = this.getEquippedWeapons()
      .map(w => String(w?.system?.weapon?.type ?? "").trim())
      .filter(Boolean);

    system.debug.equippedWeaponTypes = equippedWeaponTypes;

    // Optional: last validation/roll debug slots
    system.debug.lastTalentValidation = system.debug.lastTalentValidation ?? null;
    system.debug.lastSkillRoll = system.debug.lastSkillRoll ?? null;
  }
}

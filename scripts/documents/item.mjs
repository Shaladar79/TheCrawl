// scripts/documents/item.mjs

function slugify(str) {
  return String(str ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function collectExistingKeys(item) {
  // Prefer keys on the owning actor (most relevant).
  // If no parent (world item), fall back to world items.
  const keys = new Set();

  const add = (it) => {
    const k = String(it?.system?.key ?? "").trim();
    if (k) keys.add(k);
  };

  if (item?.parent) {
    for (const it of item.parent.items) add(it);
  } else if (game?.items) {
    for (const it of game.items) add(it);
  }

  return keys;
}

function uniqueKey(base, existingKeys) {
  if (!existingKeys.has(base)) return base;

  let n = 2;
  while (existingKeys.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

function buildBaseKey({ type, name, system }) {
  const sys = system ?? {};
  const nameSlug = slugify(name) || type || "item";

  if (type === "skill") {
    // Keep your existing scheme:
    // - spellSchool skills get a prefix
    const category = String(sys.category ?? "").trim();
    return (category === "spellSchool") ? `spellschool-${nameSlug}` : nameSlug;
  }

  if (type === "talent") {
    // Use subtype prefix:
    // talent-spell-fireball
    // talent-specialattack-cleave
    const subtype = slugify(sys.subtype) || "";
    return subtype ? `talent-${subtype}-${nameSlug}` : `talent-${nameSlug}`;
  }

  if (type === "feature") {
    // Use category (or subtype if you later add it) as a prefix:
    // feature-passive-darkvision
    // feature-aura-intimidating-presence
    const category = slugify(sys.category) || "";
    const subtype = slugify(sys.subtype) || "";
    const prefix = subtype || category;
    return prefix ? `feature-${prefix}-${nameSlug}` : `feature-${nameSlug}`;
  }

  // No auto-keying for other item types yet
  return null;
}

export class TheCrawlItem extends Item {
  /**
   * Auto-generate system.key on creation if missing.
   * Applies to: skill, talent, feature.
   */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    const type = data?.type ?? this.type;
    if (!["skill", "talent", "feature"].includes(type)) return;

    const sys = data?.system ?? {};
    const currentKey = String(sys.key ?? "").trim();
    if (currentKey) return; // do not override existing keys

    const name = data?.name ?? this.name ?? "";
    const base = buildBaseKey({ type, name, system: sys });
    if (!base) return;

    const existing = await collectExistingKeys(this);
    const finalKey = uniqueKey(base, existing);

    // Set key into pending creation data
    this.updateSource({ system: { key: finalKey } });
  }
}

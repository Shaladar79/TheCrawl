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
  const keys = new Set();

  const add = (it) => {
    const k = String(it?.system?.key ?? "").trim();
    if (k) keys.add(k);
  };

  // Owned items: enforce uniqueness within that actor
  if (item?.parent) {
    for (const it of item.parent.items) add(it);
  } else if (game?.items) {
    // World items: enforce uniqueness among world items
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
    const category = String(sys.category ?? "").trim();
    return (category === "spellSchool") ? `spellschool-${nameSlug}` : nameSlug;
  }

  if (type === "talent") {
    const subtype = slugify(sys.subtype) || "";
    return subtype ? `talent-${subtype}-${nameSlug}` : `talent-${nameSlug}`;
  }

  if (type === "feature") {
    // Features are always passive adjustments; keep scheme simple and stable.
    return `feature-${nameSlug}`;
  }

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

    const currentKey = String(foundry.utils.getProperty(data, "system.key") ?? "").trim();
    if (currentKey) return; // do not override existing keys

    const name = data?.name ?? this.name ?? "";
    const base = buildBaseKey({ type, name, system: data?.system ?? {} });
    if (!base) return;

    const existing = await collectExistingKeys(this);
    const finalKey = uniqueKey(base, existing);

    // IMPORTANT: write into the CREATE payload so it persists
    foundry.utils.setProperty(data, "system.key", finalKey);

    // Extra safety
    this.updateSource({ "system.key": finalKey });
  }
}

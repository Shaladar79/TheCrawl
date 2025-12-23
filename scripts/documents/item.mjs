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
  // Try to gather keys from the owning actor (best scope) or from world items.
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

export class TheCrawlItem extends Item {
  /**
   * Auto-generate system.key on creation if missing.
   * Applies to Skill items (and you can expand later).
   */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Only auto-key on skill items for now
    const type = data?.type ?? this.type;
    if (type !== "skill") return;

    const sys = data?.system ?? {};
    const currentKey = String(sys.key ?? "").trim();
    if (currentKey) return; // do not override

    const name = data?.name ?? this.name ?? "";
    const category = String(sys.category ?? "").trim();

    // Base key scheme:
    // - If category is "spellSchool", prefix it (helps clarity for validation)
    // - Otherwise just use the name slug.
    const nameSlug = slugify(name) || "skill";
    const base = (category === "spellSchool") ? `spellschool-${nameSlug}` : nameSlug;

    const existing = await collectExistingKeys(this);
    const finalKey = uniqueKey(base, existing);

    // Set key into pending creation data
    this.updateSource({ system: { key: finalKey } });
  }
}
